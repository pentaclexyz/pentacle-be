"use strict";

/**
 *  article controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::treasury-account.treasury-account",
  ({ strapi }) => ({
    async refreshData() {
      const data = await strapi
        .service("api::treasury-account.treasury-account")
        .refreshData();

      return data;
    },
    async getByWallet({ params }) {
      const { wallet_address } = params;

      const data = await strapi
        .service("api::treasury-account.treasury-account")
        .getByWallet(wallet_address);

      return data;
    },
    async resolveEns({ params }) {
      const { wallet_address } = params;

      const data = await strapi
        .service("api::treasury-account.treasury-account")
        .resolveEns(wallet_address);

      return data;
    },
  })
);
