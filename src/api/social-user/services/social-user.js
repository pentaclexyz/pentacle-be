"use strict";

/**
 * social-user service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const {
  fetchGithubProfile,
  fetchTwitterProfile,
  fetchFarcasterProfile,
} = require("../../../util/util");

module.exports = createCoreService(
  "api::social-user.social-user",
  ({ strapi }) => ({
    async handleGithub(handle, platform) {
      const ghProfile = await fetchGithubProfile(handle);
      if (ghProfile) {
        const existingUserWithSameId = await strapi.db
          .query("api::social-user.social-user")
          .findOne({
            where: { platform_id: `${ghProfile.id}` },
          });
        if (existingUserWithSameId) {
          const updatedUser = await strapi.entityService.update(
            "api::social-user.social-user",
            existingUserWithSameId.id,
            {
              data: {
                handle,
                platform,
                platform_id: `${ghProfile.id}`,
                pfp: ghProfile.avatar_url,
              },
            }
          );
          return updatedUser;
        }
        const newUser = await strapi.entityService.create(
          "api::social-user.social-user",
          {
            data: {
              handle,
              platform,
              platform_id: `${ghProfile.id}`,
              pfp: ghProfile.avatar_url,
            },
          }
        );

        return newUser;
      }
    },
    async handleTwitter(handle, platform) {
      const twitterProfile = await fetchTwitterProfile(handle);
      if (twitterProfile) {
        const existingUserWithSameId = await strapi.db
          .query("api::social-user.social-user")
          .findOne({
            where: { platform_id: twitterProfile.id_str },
          });
        if (existingUserWithSameId) {
          const updatedUser = await strapi.entityService.update(
            "api::social-user.social-user",
            existingUserWithSameId.id,
            {
              data: {
                handle,
                platform,
                platform_id: twitterProfile.id_str,
                pfp: twitterProfile.profile_image_url_https?.replace(
                  "_normal",
                  "_bigger"
                ),
              },
            }
          );
          return updatedUser;
        }
        const newUser = await strapi.entityService.create(
          "api::social-user.social-user",
          {
            data: {
              handle,
              platform,
              platform_id: twitterProfile.id_str,
              pfp: twitterProfile.profile_image_url_https?.replace(
                "_normal",
                "_bigger"
              ),
            },
          }
        );
        return newUser;
      }
    },
    async handleFarcaster(handle, platform) {
      const farcasterProfile = await fetchFarcasterProfile(handle);
      if (farcasterProfile) {
        const existingUserWithSameId = await strapi.db
          .query("api::social-user.social-user")
          .findOne({
            where: { platform_id: `${farcasterProfile.fid}` },
          });
        if (existingUserWithSameId) {
          const updatedUser = await strapi.entityService.update(
            "api::social-user.social-user",
            existingUserWithSameId.id,
            {
              data: {
                handle,
                platform,
                platform_id: `${farcasterProfile.fid}`,
                pfp: farcasterProfile.pfp_url,
              },
            }
          );
          return updatedUser;
        }
        const newUser = await strapi.entityService.create(
          "api::social-user.social-user",
          {
            data: {
              handle,
              platform,
              platform_id: `${farcasterProfile.fid}`,
              pfp: farcasterProfile.pfp_url,
            },
          }
        );
        return newUser;
      }
    },
    async create(users) {
      const returnData = [];
      const profiles = users.split(",").map((user) => user.split(":"));
      for (const [handle, platform] of profiles) {
        if (!handle || !platform) {
          returnData.push({
            error: "Invalid profile, must be <handle>/<platform>",
          });
        }
        const existingUser = await strapi.db
          .query("api::social-user.social-user")
          .findOne({
            where: { handle, platform },
          });
        if (existingUser) {
          // check user
          returnData.push(existingUser);
          continue;
        } else {
          if (platform === "github") {
            const newUser = await this.handleGithub(handle, platform);
            returnData.push(newUser);
          }
          if (platform === "twitter") {
            const twitterProfile = await this.handleTwitter(handle, platform);
            returnData.push(twitterProfile);
          }
          if (platform === "farcaster") {
            const farcasterProfile = await this.handleFarcaster(
              handle,
              platform
            );
            returnData.push(farcasterProfile);
          }
        }
      }
      return returnData;
    },
    async getProfiles(users) {
      const returnData = [];
      const profiles = users.split(",").map((user) => user.split(":"));
      for (const [handle, platform] of profiles) {
        if (!handle || !platform) {
          returnData.push({
            error: "Invalid profile, must be <handle>/<platform>",
          });
        }
        const user = await strapi.db
          .query("api::social-user.social-user")
          .findOne({
            where: { handle, platform },
          });
        if (!user) {
          returnData.push({
            error: `User "${handle}:${platform}" not found`,
          });
        } else {
          returnData.push(user);
        }
      }
      return returnData;
    },
    async getPfps(users) {
      const returnData = await this.getProfiles(users);
      const profiles = users.split(",");
      return returnData.map((user, i) => {
        return {
          id: profiles[i],
          pfp: user.pfp,
        };
      });
    },
  })
);
