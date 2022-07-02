"use strict";

/**
 * tweet service.
 */
const qs = require("qs");
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const authorParams = qs.stringify({
  "user.fields": "name,profile_image_url,description",
});

module.exports = createCoreService("api::tweet.tweet", ({ strapi }) => ({
  async process({ tweet_id }) {
    const [previousTweet] = await strapi.entityService.findMany(
      "api::tweet.tweet",
      { filters: { tweet_id } }
    );

    if (previousTweet) {
      const [previousAuthor] = await strapi.entityService.findMany(
        "api::tweet.twitter-user",
        { filters: { twitter_user_id: previousTweet.author_id } }
      );
      if (previousAuthor) {
        return { tweet: previousTweet, author: previousAuthor };
      } else {
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
        const res = await fetch(
          `https://api.twitter.com/2/users/${author_id}?${authorParams.toString()}` +
            {
              headers: {
                Authorization: `Bearer ${process.env.TWITTER_BEARER}`,
              },
            }
        ).then((res) => res.json());
        const  {
          data: { id: authorId, ...authorResult },
        }= res;

        const updatedAuthor = {
          twitter_user_id: `${author_id}`,
          ...authorResult,
        };
        await strapi
          .service("api::tweet.twitter-user")
          .create({ data: updatedAuthor });
        return { tweet: previousTweet, author: updatedAuthor };
      }
    }

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

    const [previousAuthor] = await strapi.entityService.findMany(
      "api::tweet.twitter-user",
      { filters: { twitter_user_id: author_id } }
    );
    const updatedTweet = {
      ...tweetResult,
      tweet_id: `${tweet_id}`,
      twitter_user_id: `${author_id}`,
    };

    await strapi.service("api::tweet.tweet").create({ data: updatedTweet });

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

    await strapi
      .service("api::tweet.twitter-user")
      .create({ data: updatedAuthor });

    return {
      author: updatedAuthor,
      tweet: updatedTweet,
    };
  },
}));
