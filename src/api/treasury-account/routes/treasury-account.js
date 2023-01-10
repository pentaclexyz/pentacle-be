"use strict";

/**
 * article router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;
const defaultRouter = createCoreRouter("api::treasury-account.treasury-account");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "GET",
    path: "/treasury-account/refresh",
    handler: "api::treasury-account.treasury-account.refreshData",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/treasury-account/get-by-wallet/:wallet_address",
    handler: "api::treasury-account.treasury-account.getByWallet",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/treasury-account/resolve-ens/:wallet_address",
    handler: "api::treasury-account.treasury-account.resolveEns",
    config: {
      auth: false,
    }
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
