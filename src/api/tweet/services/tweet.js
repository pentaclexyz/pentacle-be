"use strict";

/**
 * tweet service.
 */
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const fs = require("fs"); // Built-in filesystem package for Node.js
const { join } = require("path");
const { fetchTwitterProfile } = require("../../../util/util");

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
  async getTwitterMedia(username) {
    console.log(`getting twitter banner for ${username}`);
    // TODO: get rid of this in favor of user object
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();

    const previousPeople = people.filter(
      (person) =>
        person.twitter === `https://x.com/${username}` ||
        person.twitter === `http://x.com/${username}` ||
        person.twitter === `https://www.x.com/${username}` ||
        person.twitter === `http://www.x.com/${username}` ||
        person.twitter === `https://twitter.com/${username}` ||
        person.twitter === `http://twitter.com/${username}` ||
        person.twitter === `https://www.twitter.com/${username}` ||
        person.twitter === `http://www.twitter.com/${username}`
    );
    const previousProjects = projects.filter(
      (person) =>
        person.twitter_url === `https://x.com/${username}` ||
        person.twitter_url === `http://x.com/${username}` ||
        person.twitter_url === `https://www.x.com/${username}` ||
        person.twitter_url === `http://www.x.com/${username}` ||
        person.twitter_url === `https://twitter.com/${username}` ||
        person.twitter_url === `http://twitter.com/${username}` ||
        person.twitter_url === `https://www.twitter.com/${username}` ||
        person.twitter_url === `http://www.twitter.com/${username}`
    );

    if (!previousPeople.length && !previousProjects.length) {
      console.log(
        `no person or project found for ${username}. Check casing and make sure the twitter url is correct`
      );
      return;
    }

    const needsUpdate = await Promise.all([
      ...previousPeople.map(checkTwitterImages),
      ...previousProjects.map(checkTwitterImages),
    ]);

    if (!needsUpdate.some((item) => !!item)) {
      console.log(`no update needed for ${username}`);
      return { success: true, message: "no update needed" };
    }

    const response = await fetchTwitterProfile(username);

    if (previousPeople) {
      for (const person of previousPeople) {
        await strapi.entityService.update("api::person.person", person.id, {
          data: {
            twitter_img: response.profile_image_url_https?.replace(
              "_normal",
              "_bigger"
            ),
            twitter_banner: response.profile_banner_url?.replace(
              "_normal",
              "_bigger"
            ),
          },
        });
      }
    }
    if (previousProjects) {
      for (const project of previousProjects) {
        await strapi.entityService.update("api::project.project", project.id, {
          data: {
            twitter_img: response.profile_image_url_https,
            twitter_banner: response.profile_banner_url,
          },
        });
      }
    }
    return { success: true };
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
  async syncTwitterMedia() {
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
      await this.getTwitterMedia(handle);
    }
    for (const person of people) {
      if (!person.twitter) {
        continue;
      }
      const handle = getHandleFromTwitterUrl(person.twitter).replaceAll(
        "/",
        ""
      );
      await this.getTwitterMedia(handle);
    }
    return { success: true };
  },
}));
