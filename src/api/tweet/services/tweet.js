"use strict";

/**
 * tweet service.
 */
const qs = require("qs");
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs"); // Built-in filesystem package for Node.js
const { join } = require("path");
if (!String.prototype.replaceAll) {
  String.prototype.replaceAll = function (str, newStr) {
    // If a regex pattern
    if (
      Object.prototype.toString.call(str).toLowerCase() === "[object regexp]"
    ) {
      return this.replace(str, newStr);
    }

    // If a string
    return this.replace(new RegExp(str, "g"), newStr);
  };
}

function sliceIntoChunks(arr, chunkSize) {
  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const getHandleFromTwitterUrl = (str = "") =>
  (str || "")
    .replace("https://twitter.com/", "")
    .replace("http://twitter.com/", "")
    .replace("https://www.twitter.com/", "");

const checkTwitterImages = async (entity) => {
  const { twitter_banner, twitter_img } = entity;
  if (!twitter_banner || !twitter_img) {
    return true;
  }
  const bannerRes = await fetch(twitter_banner, {
    method: "HEAD",
  });
  const pfpRes = await fetch(twitter_img, {
    method: "HEAD",
  });
  if (bannerRes.status !== 200 || pfpRes.status !== 200) {
    return true;
  }
  return false;
};

module.exports = createCoreService("api::tweet.tweet", ({ strapi }) => ({
  async getUserTwitterInfo(username, query) {
    const { data, errors } = await fetch(
      `https://api.twitter.com/2/users/by?usernames=${username}&${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    ).then((res) => res.json());

    if (errors) {
      console.error(errors);
    }

    return data;
  },

  async getTwitterBanner(username) {
    console.log(`getting twitter banner for ${username}`);
    // TODO: get rid of this in favor of user object
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();

    const previousPerson = people.find(
      (person) => person.twitter === `https://twitter.com/${username}`
    );
    const previousProject = projects.find(
      (person) => person.twitter_url === `https://twitter.com/${username}`
    );
    debugger;
    if (!previousPerson && !previousProject) {
      console.log(`no person or project found for ${username}`);
      console.log({ previousPerson, previousProject });
      return;
    }
    const needsUpdate = await checkTwitterImages(
      previousPerson || previousProject
    );

    if (!needsUpdate) {
      return;
    }

    const response = await fetch(
      `https://api.twitter.com/1.1/users/show.json?screen_name=${username}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    ).then((res) => {
      console.log(`API returned :${res.status}: ${res.statusText}`);
      return res.json();
    });

    if (previousPerson) {
      await strapi.entityService.update(
        "api::person.person",
        previousPerson.id,
        {
          data: {
            twitter_img: response.profile_image_url_https,
            twitter_banner: response.profile_banner_url,
          },
        }
      );
    }
    if (previousProject) {
      await strapi.entityService.update(
        "api::project.project",
        previousProject.id,
        {
          data: {
            twitter_img: response.profile_image_url_https,
            twitter_banner: response.profile_banner_url,
          },
        }
      );
    }
    return { success: true };
  },

  async getPinnedTweetIdByUsername(userName) {
    const query = qs.stringify({
      expansions: "pinned_tweet_id",
    });
    const twitterInfo = await this.getUserTwitterInfo(userName, query);
    const pinnedTweetId = twitterInfo[0].pinned_tweet_id;

    if (!pinnedTweetId) return null;

    return pinnedTweetId;
  },
  async allToLowercase() {
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();
    console.log(`lowercasing ${projects.length + people.length} items`);

    for (const project of projects) {
      if (project.twitter_url) {
        const lowercaseName = project.twitter_url.toLowerCase();
        await strapi.entityService.update("api::project.project", project.id, {
          data: {
            ...project,
            twitter_url: lowercaseName,
          },
        });
      }
    }
    for (const person of people) {
      if (person.twitter) {
        const lowercaseName = person.twitter.toLowerCase();
        await strapi.entityService.update("api::person.person", person.id, {
          data: {
            ...person,
            twitter: lowercaseName,
          },
        });
      }
    }

    return { success: true };
  },
  async saveAllTwitterPfps() {
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();
    for (const project of projects) {
      if (project.twitter_img) {
        await fetch(project.twitter_img.replace("_normal", "_bigger")).then(
          (res) =>
            res.body.pipe(
              fs.createWriteStream(
                join(
                  process.cwd(),
                  "../",
                  `/images/projects/${project.slug}.png`
                )
              )
            )
        );
      }
    }
    for (const person of people) {
      if (person.twitter_img) {
        await fetch(person.twitter_img.replace("_normal", "_bigger")).then(
          (res) =>
            res.body.pipe(
              fs.createWriteStream(
                join(process.cwd(), "../", `/images/people/${person.slug}.png`)
              )
            )
        );
      }
    }

    return { success: true };
  },
  async syncProfileBanners() {
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();
    for (const project of projects) {
      if (!project.twitter_url) {
        continue;
      }
      const handle = getHandleFromTwitterUrl(project.twitter_url).replaceAll(
        "/",
        ""
      );
      await this.getTwitterBanner(handle);
    }
    for (const person of people) {
      if (!person.twitter) {
        continue;
      }
      const handle = getHandleFromTwitterUrl(person.twitter).replaceAll(
        "/",
        ""
      );
      await this.getTwitterBanner(handle);
    }
    return { success: true };
  },
  async getAndSetAllProfiles() {
    const query = qs.stringify({
      "user.fields": "profile_image_url",
    });
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();
    const chunkedProjects = sliceIntoChunks(projects, 100);
    const chunkedPeople = sliceIntoChunks(people, 100);
    console.log(`setting ${projects.length + people.length} images`);
    for (const chunk of chunkedProjects) {
      // console.log(`fetching twitter pfp for ${project.name}`);
      const names = chunk
        .map((item) =>
          getHandleFromTwitterUrl(item.twitter_url).replaceAll("/", "")
        )
        .filter((d) => d)
        .join(",");

      const twitterInfos = await this.getUserTwitterInfo(names, query);

      if (twitterInfos?.length) {
        for (const info of twitterInfos) {
          const projects = (
            await strapi.service("api::project.project").find({
              filters: {
                twitter_url: `https://twitter.com/${info.username.toLowerCase()}`,
              },
            })
          ).results;

          for (const project of projects) {
            const profileImageUrl = info.profile_image_url.replace(
              "_normal",
              "_bigger"
            );

            await strapi.entityService.update(
              "api::project.project",
              project.id,
              {
                data: {
                  ...project,
                  twitter_img: profileImageUrl,
                },
              }
            );
          }
        }
      }
    }
    for (const chunk of chunkedPeople) {
      // console.log(`fetching twitter pfp for ${project.name}`);
      const names = chunk
        .map((item) =>
          getHandleFromTwitterUrl(item.twitter).replaceAll("/", "")
        )
        .filter((d) => d)
        .join(",");

      const query = qs.stringify({
        "user.fields": "profile_image_url,description",
      });
      // await this.getProfileImageByUsername(names);
      const twitterInfos = await this.getUserTwitterInfo(names, query);

      if (twitterInfos?.length) {
        for (const info of twitterInfos) {
          const people = (
            await strapi.service("api::person.person").find({
              filters: {
                twitter: `https://twitter.com/${info.username.toLowerCase()}`,
              },
            })
          ).results;

          for (const person of people) {
            const profileImageUrl = info.profile_image_url.replace(
              "_normal",
              "_bigger"
            );

            await strapi.entityService.update("api::person.person", person.id, {
              data: {
                ...person,
                twitter_img: profileImageUrl,
                bio: info.description,
              },
            });
          }
        }
      }
    }
    return { success: true };
  },
}));
