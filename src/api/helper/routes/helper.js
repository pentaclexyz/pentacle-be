"use strict";

/**
 * tweet router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::helper.helper");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "GET",
    path: "/helper/description/sync-all",
    handler: "api::helper.helper.syncDescriptions",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/helper/description/sync-project/:slug",
    handler: "api::helper.helper.syncProject",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/helper/description/sync-person/:slug",
    handler: "api::helper.helper.syncPerson",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/helper/description/sync-skill/:slug",
    handler: "api::helper.helper.syncSkill",
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
