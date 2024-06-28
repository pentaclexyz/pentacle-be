"use strict";

/**
 *  social-user controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::social-user.social-user",
  ({ strapi }) => ({
    async create({ querystring }) {
      const users = new URLSearchParams(querystring).get("users");
      const data = await strapi
        .service("api::social-user.social-user")
        .create(users);

      return data;
    },
    async getProfiles({ querystring }) {
      const users = new URLSearchParams(querystring).get("users");
      const data = await strapi
        .service("api::social-user.social-user")
        .getProfiles(users);

      return data;
    },
    async getPfps({ querystring }) {
      const users = new URLSearchParams(querystring).get("users");
      const data = await strapi
        .service("api::social-user.social-user")
        .getPfps(users);

      return data;
    },
  })
);
