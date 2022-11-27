"use strict";

/**
 * person service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::person.person", ({ strapi }) => ({
  async create(...args) {
    const newUser = await super.create(...args);

    if (newUser.twitter.length > 0) {
      const twitterHandle = newUser.twitter.split("https://twitter.com/")[1];
      const twitterData = await strapi
        .service("api::tweet.tweet")
        .getUserTwitterInfo(twitterHandle);

      newUser.avatar.url = twitterData[0].profile_image_url;
    }

    return newUser;
  },
}));
