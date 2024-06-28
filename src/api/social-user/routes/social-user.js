"use strict";

/**
 * social-user router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::social-user.social-user");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "POST",
    path: "/social-user/create",
    handler: "api::social-user.social-user.create",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/social-user/profiles",
    handler: "api::social-user.social-user.getProfiles",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/social-user/pfps",
    handler: "api::social-user.social-user.getPfps",
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
