"use strict";

/**
 * tag service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = createCoreService(
  "api::defi-safety-report.defi-safety-report",
  ({ strapi }) => ({
    async fetchReports() {
      const allReports = await (
        await fetch(`https://api.defisafety.com/pqrs?offset=0&limit=1000`, {
          headers: { ["X-API-KEY"]: process.env.DEFI_SAFETY_KEY },
        })
      ).json();
      for (const { _id, ...report } of allReports.data) {
        const previousEntry = await strapi
          .service("api::defi-safety-report.defi-safety-report")
          .find({ filters: { defiSafetyId: `${_id}` } });
        if (!previousEntry.results.length) {
          await strapi.entityService.create(
            "api::defi-safety-report.defi-safety-report",
            {
              data: {
                defiSafetyId: `${_id}`,
                ...report,
              },
            }
          );
        } else {
          await strapi.entityService.update(
            "api::defi-safety-report.defi-safety-report",
            previousEntry.results[0].id,
            {
              data: {
                defiSafetyId: `${_id}`,
                ...report,
              },
            }
          );
        }
      }
      return allReports;
    },
    async getById(id) {
      const previousEntry = await strapi
        .service("api::defi-safety-report.defi-safety-report")
        .find({ filters: { defiSafetyId: `${id}` } });
      
      return previousEntry;
    },
  })
);
