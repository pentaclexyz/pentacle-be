"use strict";

/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::tweet.twitter-list",
  ({ strapi }) => ({
    async getLists({ params: { screen_name } }) {
      const data = await strapi
        .service("api::tweet.twitter-list")
        .getLists({ screen_name });

      return data;
    },
  })
);
