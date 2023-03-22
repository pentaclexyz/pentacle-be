"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::governance-discussion.governance-discussion",
  ({ strapi }) => ({
    async refreshData() {
      const data = await strapi
        .service("api::governance-discussion.governance-discussion")
        .refreshData();

      return data;
    },
    async byProjectSlug({ params }) {
      const { slug } = params;
      const data = await strapi
        .service("api::governance-discussion.governance-discussion")
        .byProjectSlug({ slug });

      return data;
    },
    async allWithProject() {
      const data = await strapi
        .service("api::governance-discussion.governance-discussion")
        .allWithProject();

      return data;
    }
  })
);
