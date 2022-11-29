"use strict";

/**
 * pinned-tweet service.
 */
const { createCoreService } = require("@strapi/strapi").factories;
const qs = require("qs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const query = qs.stringify({
  expansions: "pinned_tweet_id",
});

module.exports = createCoreService("api::tweet.pinned-tweet", ({ strapi }) => ({
  async getUserTwitterInfo(username) {
    const { data } = await fetch(
      `https://api.twitter.com/2/users/by?usernames=${username}&${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    ).then((res) => {
      console.log(
        `request to twitter API, status: ${res.status}: ${res.statusText}`
      );
      return res.json();
    });

    return data;
  },
  // TODO: needs to check cache
  async getPinnedTweetIdByUsername(username) {
    const previousTweet = (
      await strapi
        .service("api::tweet.pinned-tweet")
        .find({ filters: { username } })
    ).results;

    if (!previousTweet[0]?.pinned_tweet_id) {
      const twitterInfo = await this.getUserTwitterInfo(username);

      if (!twitterInfo)
        return { pinnedTweetId: "", error: "twitterInfo not found" };

      const pinnedTweetId = twitterInfo[0].pinned_tweet_id;

      if (!pinnedTweetId)
        return { pinnedTweetId: "", error: "pinnedTweetId not found" };

      await strapi.entityService.create("api::tweet.pinned-tweet", {
        data: {
          username,
          pinned_tweet_id: pinnedTweetId,
        },
      });

      return { pinnedTweetId };
    } else {
      return {
        pinnedTweetId: previousTweet[0].pinned_tweet_id,
      };
    }
  },
}));
