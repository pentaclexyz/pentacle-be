"use strict";

/**
 * helper router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::project.project");
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
    method: "GET",
    path: "/projects-slim",
    handler: "api::project.project.getSlim",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/projects-related",
    handler: "api::project.project.getRelated",
    config: {
      auth: false,
    },
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
