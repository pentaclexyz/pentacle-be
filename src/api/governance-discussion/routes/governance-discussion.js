"use strict";

/**
 * tweet router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::governance-discussion.governance-discussion");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "POST",
    path: "/governance-discussion/refresh",
    handler: "api::governance-discussion.governance-discussion.refreshData"
  },
  {
    method: "GET",
    path: "/governance-discussion/byProjectSlug/:slug",
    handler: "api::governance-discussion.governance-discussion.byProjectSlug"
  },
  {
    method: "GET",
    path: "/governance-discussion/allWithProject",
    handler: "api::governance-discussion.governance-discussion.allWithProject"
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
