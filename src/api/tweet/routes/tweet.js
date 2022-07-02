"use strict";

/**
 * tweet router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::tweet.tweet");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "GET",
    path: "/tweet/process/:id",
    handler: "api::tweet.tweet.process",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
