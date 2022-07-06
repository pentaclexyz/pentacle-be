"use strict";

/**
 * A addFave of functions called "actions" for `fave`
 */

/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::fave.fave", ({ strapi }) => ({
  async addFave({ query }) {
    const { owner, item_id, signature } = query;
    return await strapi
      .service("api::fave.fave")
      .addFave({ owner, item_id, signature });
  },
  async getByOwner({ query }) {
    const { owner, signature } = query;
    return await strapi
      .service("api::fave.fave")
      .getByOwner({ owner, signature });
  },
}));
