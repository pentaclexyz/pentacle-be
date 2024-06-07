"use strict";
const _ = require("lodash");
const { verifyMessage } = require("viem");
const { getHandleFromTwitterUrl } = require("./util/util");
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    strapi
      .plugin("documentation")
      .service("override")
      // TODO: update list
      .excludeFromGeneration([
        "defi-safety-report",
        "section",
        "lore",
        "tweet",
        "term",
        "helper",
        "homepage",
        "connect",
        "auth",
        "governance-discussion",
        "governance-proposal",
        "global",
        "content-type",
        "audit",
        "about",
      ]);
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      async beforeCreate(event) {
        try {
          const ctx = strapi.requestContext.get();
          if (event.model.singularName === "submission") {
            const { signature, address, ...rest } = event.params.data;
            event.params.data = rest;
            event.params.data.slug = _.kebabCase(event.params.data.slug);
            const isValid = await verifyMessage({
              address,
              message: "Sign this message to submit a project",
              signature,
            });
            if (!isValid) {
              ctx.throw(400, "Invalid signature");
              return;
            }
          }

          if (event.model.singularName === "person") {
            event.params.data.twitter =
              event.params.data?.twitter?.toLowerCase();
          }
          if (event.model.singularName === "project") {
            event.params.data.twitter_url =
              event.params.data?.twitter_url?.toLowerCase();
          }

          if (
            event.model.singularName === "person" ||
            event.model.singularName === "project"
          ) {
            const username =
              event.model.singularName === "person"
                ? event.params.data.twitter
                : event.params.data.twitter_url;
            const response = await fetch(
              `https://api.socialdata.tools/twitter/user/${getHandleFromTwitterUrl(
                username
              )}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.SOCIALDATA_KEY}`,
                },
              }
            ).then((res) => {
              console.log(`API returned :${res.status}: ${res.statusText}`);
              return res.json();
            });
            if (!event.params.data.twitter_img) {
              event.params.data.twitter_img =
                response.profile_image_url_https?.replace("_normal", "_bigger");
            }
            if (!event.params.data.twitter_banner) {
              event.params.data.twitter_banner =
                response.profile_banner_url?.replace("_normal", "_bigger");
            }
          }

          event.params.data.slug = _.kebabCase(event.params.data.slug);
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
};
