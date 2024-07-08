"use strict";

/**
 * helper router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::project.project", {
  config: {
    find: {
      middlewares: ["api::project.logger"],
    },
  },
});
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "POST",
    path: "/projects/create-submission",
    handler: "api::project.project.createSubmission",
    config: {
      auth: false,
    },
  },
  {
    method: "POST",
    path: "/projects/update-project",
    handler: "api::project.project.updateProject",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/projects-slim",
    handler: "api::project.project.getSlim",
  },
  {
    method: "GET",
    path: "/projects-related",
    handler: "api::project.project.getRelated",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
