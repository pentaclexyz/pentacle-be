"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const qs = require("qs");
/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tweet.tweet", ({ strapi }) => ({
  async getPinnedTweetId({ params }) {
    const username = params.id;

    const data = await strapi
      .service("api::tweet.tweet")
      .getPinnedTweetIdByUsername(username);

    return data;
  },
  async getTwitterBanner({ params }) {
    const username = params.id;

    const data = await strapi
      .service("api::tweet.tweet")
      .getTwitterBanner(username);

    return data;
  },
  async getAndSetAllImages() {
    const data = await strapi
      .service("api::tweet.tweet")
      .getAndSetAllImages();

    return data;
  },
}));
