"use strict";

/**
 * person-submission router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter(
  "api::person-submission.person-submission"
);

module.exports = defaultRouter;
