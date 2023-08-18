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
    path: "/tweet/sync-profile-banners",
    handler: "api::tweet.tweet.syncProfileBanners",
    config: {
      auth: false,
    }
  },
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
    path: "/tweet/save-all-twitter-pfps",
    handler: "api::tweet.tweet.saveAllTwitterPfps",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/tweet/get-and-set-all-images",
    handler: "api::tweet.tweet.getAndSetAllProfiles",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/tweet/all-to-lowercase",
    handler: "api::tweet.tweet.allToLowercase",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/tweet/twitter_lists/:screen_name",
    handler: "api::tweet.twitter-list.getLists",
    config: {
      auth: false,
    }
  },
  
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
