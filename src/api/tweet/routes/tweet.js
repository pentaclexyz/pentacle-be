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
    path: "/tweet/sync-twitter-media",
    handler: "api::tweet.tweet.syncTwitterMedia",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/tweet/sync-single-twitter-media/:id",
    handler: "api::tweet.tweet.syncSingleTwitterMedia",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/tweet/all-to-lowercase",
    handler: "api::tweet.tweet.allToLowercase",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/tweet/twitter_lists/:screen_name",
    handler: "api::tweet.twitter-list.getLists",
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
