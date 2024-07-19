import { Strapi } from "@strapi/strapi";

export default {
  "0 */4 * * *": async ({ strapi }: { strapi: Strapi }) => {
    await strapi
      .service("api::governance-proposal.governance-proposal")
      .refreshData();
    await strapi
      .service("api::governance-discussion.governance-discussion")
      .refreshData();
  },
  // Once a day
  "0 0 * * *": async ({ strapi }: { strapi: Strapi }) => {
    await strapi
      .service("api::defi-safety-report.defi-safety-report")
      .fetchReports();
    await strapi.service("api::tweet.tweet").getAndSetAllProfiles();
    await strapi.service("api::tweet.tweet").syncTwitterMedia();
    await strapi.service("api::helper.helper").syncDescriptions();
    await strapi.service("api::helper.helper").migrateGithub();
    await strapi
      .service("api::base-registry.base-registry-entry")
      .fetchAndUpdateAllBaseRegistryEntries();
  },
};
