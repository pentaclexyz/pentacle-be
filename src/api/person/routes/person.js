"use strict";

/**
 * person router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::person.person");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "POST",
    path: "/person/create-submission",
    handler: "api::person.person.createSubmission",
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
