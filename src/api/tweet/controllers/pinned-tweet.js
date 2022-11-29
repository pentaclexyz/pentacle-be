"use strict";

/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tweet.pinned-tweet", ({ strapi }) => ({
    async getPinnedTweetId({ params }) {
      const username = params.id;
  
      const data = await strapi
        .service("api::tweet.pinned-tweet")
        .getPinnedTweetIdByUsername(username);
  
      return data;
    },
  }));
