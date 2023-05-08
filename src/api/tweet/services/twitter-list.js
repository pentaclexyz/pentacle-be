"use strict";

const DAY_IN_MS = 86400000;
/**
 * tweet service.
 */
const fetchLists = ({ screen_name }) =>
  fetch(
    `https://api.twitter.com/1.1/lists/ownerships.json?screen_name=${screen_name}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
      },
    }
  ).then((res) => {
    console.log(`API returned :${res.status}: ${res.statusText}`);
    return res.json();
  });
const fetchListMembers = ({ list_id }) =>
  fetch(`https://api.twitter.com/1.1/lists/members.json?list_id=${list_id}`, {
    headers: {
      Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
    },
  }).then((res) => {
    console.log(`API returned :${res.status}: ${res.statusText}`);
    return res.json();
  });

const { createCoreService } = require("@strapi/strapi").factories;
module.exports = createCoreService("api::tweet.twitter-list", ({ strapi }) => ({
  async getLists({ screen_name }) {
    const found = await strapi.db.query("api::tweet.twitter-list").findMany({
      where: { screen_name },
    });
    const now = Date.now();

    if (found.length && !(now - DAY_IN_MS > +found[0].timestamp)) {
      return found[0].lists;
    }
    if (found.length && now - DAY_IN_MS > +found[0].timestamp) {
      const lists = await fetchLists({ screen_name });
      if (!lists.error) {
        if (!lists.error && lists.lists?.length) {
          const members = await fetchListMembers({ list_id: list.id_str });
          list.members = members.users.map(
            ({ profile_image_url, screen_name, id_str, description }) => ({
              profile_image_url,
              screen_name,
              id_str,
              description,
            })
          );
        }
      }

      strapi.entityService.update("api::tweet.twitter-list", found[0].id, {
        data: {
          timestamp: Date.now(),
          screen_name,
          lists,
        },
      });
      return lists;
    }
    if (!found.length) {
      const lists = await fetchLists({ screen_name });
      if (!lists.error && lists.lists?.length) {
        for (const list of lists.lists) {
          const members = await fetchListMembers({ list_id: list.id_str });
          list.members = members.users.map(
            ({ profile_image_url, screen_name, id_str, description }) => ({
              profile_image_url,
              screen_name,
              id_str,
              description,
            })
          );
        }
      }

      strapi.entityService.create("api::tweet.twitter-list", {
        data: {
          timestamp: Date.now(),
          screen_name,
          lists,
        },
      });

      return lists;
    }
  },
}));
