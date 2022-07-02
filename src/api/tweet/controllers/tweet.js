"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const qs = require("qs");
/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tweet.tweet", ({ strapi }) => ({
  async process({ req, res, params }) {
    const tweet_id = params.id;
    const { tweet, author } = await strapi
      .service("api::tweet.tweet")
      .process({ tweet_id });

    return { tweet, author };
  },
}));
