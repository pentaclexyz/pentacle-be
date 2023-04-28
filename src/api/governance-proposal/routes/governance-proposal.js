"use strict";

/**
 * tweet router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::governance-proposal.governance-proposal");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "POST",
    path: "/governance-proposal/refresh",
    handler: "api::governance-proposal.governance-proposal.refreshData",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/governance-proposal/get-ordered-by-date",
    handler: "api::governance-proposal.governance-proposal.getOrderedByEndDate",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/governance-proposal/get-by-governance-url/:governance_url",
    handler: "api::governance-proposal.governance-proposal.getByGovernanceUrl"
  },
  {
    method: "GET",
    path: "/governance-proposal/getByGovernanceUrl/:governance_url",
    handler: "api::governance-proposal.governance-proposal.getByGovernanceUrl"
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
