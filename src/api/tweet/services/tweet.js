"use strict";

/**
 * tweet service.
 */
const qs = require("qs");
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = createCoreService("api::tweet.tweet", ({ strapi }) => ({
  async process({ tweet_id }) {
    const tweetParams = qs.stringify({
      ids: tweet_id,
      //   expansions: "attachments.media_keys",
      "tweet.fields": "created_at,author_id",
    });
    const { data } = await fetch(
      "https://api.twitter.com/2/tweets?" + tweetParams.toString(),
      { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` } }
    ).then((res) => res.json());
    const [{ id: _tweet_id, ...tweetResult }] = data;
    const author_id = tweetResult.author_id;
    const authorParams = qs.stringify({
      "user.fields": "name,verified,profile_image_url,description",
    });
    const [previousAuthor] = await strapi.entityService.findMany(
      "api::tweet.twitter-user",
      { filter: { twitter_user_id: author_id } }
    );
    const updatedTweet = {
      ...tweetResult,
      tweet_id: `${tweet_id}`,
      twitter_user_id: `${author_id}`,
    };
    if (previousAuthor) {
      return { author: previousAuthor, updatedTweet };
    }
    const {
      data: { id: _authorId, ...authorResult },
    } = await fetch(
      "https://api.twitter.com/2/users/" +
        author_id +
        "?" +
        authorParams.toString(),
      { headers: { Authorization: `Bearer ${process.env.TWITTER_BEARER}` } }
    ).then((res) => res.json());

    const updatedAuthor = { twitter_user_id: `${author_id}`, ...authorResult };

    return {
      author: updatedAuthor,
      tweet: updatedTweet,
    };
  },
}));
