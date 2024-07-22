"use strict";
/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tweet.tweet", ({ strapi }) => ({
  async getAndSetAllProfiles() {
    const data = await strapi
      .service("api::tweet.tweet")
      .getAndSetAllProfiles();

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
