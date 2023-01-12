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
    path: "/tweet/pinned_id/:id",
    handler: "api::tweet.tweet.getPinnedTweetId",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/tweet/twitter_banner/:id",
    handler: "api::tweet.tweet.getTwitterBanner",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/tweet/get-and-set-all-images",
    handler: "api::tweet.tweet.getAndSetAllImages",
    config: {
      auth: false,
    }
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
