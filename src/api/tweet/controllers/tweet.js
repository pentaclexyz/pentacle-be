"use strict";

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
const qs = require("qs");
/**
 *  tweet controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::tweet.tweet", ({ strapi }) => ({
  async process({ req, res, params }) {
    const tweet_id = params.id;

    const [previousTweet] = await strapi.entityService.findMany(
      "api::tweet.tweet",
      { filter: { tweet_id } }
    );

    if (previousTweet) {
      const [previousAuthor] = await strapi.entityService.findMany(
        "api::tweet.twitter-user",
        { filter: { twitter_user_id: previousTweet.author_id } }
      );
      return { tweet: previousTweet, author: previousAuthor };
    }

    const { tweet, author } = await strapi
      .service("api::tweet.tweet")
      .process({ tweet_id });

    await strapi.service("api::tweet.tweet").create({ data: tweet });
    await strapi.service("api::tweet.twitter-user").create({ data: author });

    return { tweet, author };
  },
}));
