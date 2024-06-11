"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tag.tag", ({ strapi }) => ({
  async getSlim(ctx) {
    const data = await strapi.service("api::tag.tag").getSlim(ctx);
    return data;
  },
}));
