"use strict";

/**
 * tweet service.
 */
const qs = require("qs");
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

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
    const previousEntry = await strapi
      .service("api::tweet.twitter-banner")
      .find({ filters: { twitter_handle: username } });

    if (!previousEntry?.results[0]?.profile_banner_url) {
      const { profile_banner_url } = await fetch(
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
      if (profile_banner_url) {
        await strapi.entityService.create("api::tweet.twitter-banner", {
          data: {
            profile_banner_url,
            twitter_handle: username,
          },
        });
        return { profile_banner_url };
      }
      return { profile_banner_url: "" };
    } else {
      const res = await fetch(previousEntry.results[0].profile_banner_url, {
        method: "HEAD",
      });
      if (res.status !== 200) {
        const { profile_banner_url } = await fetch(
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

        await strapi.entityService.update(
          "api::tweet.twitter-banner",
          previousEntry.results[0].id,
          {
            data: {
              profile_banner_url,
              twitter_handle: username,
            },
          }
        );
        return { profile_banner_url };
      }
      return {
        profile_banner_url: previousEntry.results[0].profile_banner_url || null,
      };
    }
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
                bio: info.description
              },
            });
          }
        }
      }
    }
    return { success: true };
  },
}));
