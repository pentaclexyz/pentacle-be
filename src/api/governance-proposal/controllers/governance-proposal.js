"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::governance-proposal.governance-proposal",
  ({ strapi }) => ({
    async refreshData() {
      const data = await strapi
        .service("api::governance-proposal.governance-proposal")
        .refreshData();

      return data;
    },
    async getOrderedByEndDate() {
      const data = await strapi
        .service("api::governance-proposal.governance-proposal")
        .getOrderedByEndDate();

      return data;
    },
    async getByGovernanceUrl({ params }) {
      const { governance_url } = params;
      const data = await strapi
        .service("api::governance-proposal.governance-proposal")
        .getByGovernanceUrl({ governance_url });

      return data;
    },
  })
);
