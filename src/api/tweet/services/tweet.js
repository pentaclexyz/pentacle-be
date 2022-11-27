"use strict";

/**
 * tweet service.
 */
const qs = require("qs");
const { createCoreService } = require("@strapi/strapi").factories;
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

const query = qs.stringify({
  "user.fields": "profile_image_url",
  expansions: "pinned_tweet_id",
});

module.exports = createCoreService("api::tweet.tweet", ({ strapi }) => ({
  async getUserTwitterInfo(username) {
    const { data } = await fetch(
      `https://api.twitter.com/2/users/by?usernames=${username}&${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      }
    ).then((res) => res.json());

    return data;
  },

  async getPinnedTweetIdByUsername(userName) {
    const twitterInfo = await this.getUserTwitterInfo(userName);
    const pinnedTweetId = twitterInfo[0].pinned_tweet_id;

    if (!pinnedTweetId) return null;

    return pinnedTweetId;
  },
  async getProfileImageByUsername(userName) {
    try {
      const previousImg = (
        await strapi
          .service("api::tweet.twitter-img")
          .find({ filters: { twitter_handle: userName } })
      ).results;
      if (!previousImg[0]?.url) {
        const twitterInfo = await this.getUserTwitterInfo(userName);
        if (!twitterInfo || !twitterInfo[0]) {
          console.log(`could not fetch for ${userName}`);
          return { avatar: "" };
        }
        const profileImageUrl = twitterInfo[0].profile_image_url;

        if (!profileImageUrl) return null;

        await strapi.entityService.create("api::tweet.twitter-img", {
          data: {
            url: twitterInfo[0].profile_image_url.replace("_normal", "_bigger"),
            twitter_user_id: twitterInfo[0].id,
            twitter_handle: userName,
          },
        });

        return { avatar: profileImageUrl };
      } else {
        return { avatar: previousImg[0].url };
      }
    } catch (e) {
      console.log(`could not fetch for ${userName}`);
      console.log(e);
      return { avatar: "" };
    }
  },
}));
