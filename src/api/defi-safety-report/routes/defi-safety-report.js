"use strict";


const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::defi-safety-report.defi-safety-report");
const { customRouter } = require("../../../util/custom-router");
const myExtraRoutes = [
  {
    method: "GET",
    path: "/defi-safety-report/:id",
    handler: "api::defi-safety-report.defi-safety-report.getById",
    config: {
      auth: false,
    }
  },
  {
    method: "GET",
    path: "/defi-safety-report/fetch-reports",
    handler: "api::defi-safety-report.defi-safety-report.fetchReports",
    config: {
      auth: false,
    }
  }
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
