"use strict";

/**
 * project-submission router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter(
  "api::project-submission.project-submission"
);

module.exports = defaultRouter;
