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
  async getAndSetAllProfiles() {
    const data = await strapi
      .service("api::tweet.tweet")
      .getAndSetAllProfiles();

    return data;
  },
  async saveAllTwitterPfps() {
    const data = await strapi.service("api::tweet.tweet").saveAllTwitterPfps();

    return data;
  },
  async allToLowercase() {
    const data = await strapi.service("api::tweet.tweet").allToLowercase();

    return data;
  },
  async syncTwitterMedia() {
    const data = await strapi.service("api::tweet.tweet").syncTwitterMedia();

    return data;
  },
  async syncSingleTwitterMedia({ params }) {
    const username = params.id;
    const data = await strapi
      .service("api::tweet.tweet")
      .getTwitterMedia(username);

    return data;
  },
}));
