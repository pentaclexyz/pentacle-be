"use strict";

/**
 *  tag controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController(
  "api::defi-safety-report.defi-safety-report",
  ({ strapi }) => ({
    async fetchReports() {
      const data = await strapi
        .service("api::defi-safety-report.defi-safety-report")
        .fetchReports();

      return data;
    },
    async getById({params}) {
      const {id} = params;
      const data = await strapi
        .service("api::defi-safety-report.defi-safety-report")
        .getById(id);

      return data;
    },
  })
);
