module.exports = {
  "0 */4 * * *": async ({ strapi }) => {
    await strapi
      .service("api::governance-proposal.governance-proposal")
      .refreshData();
    await strapi
      .service("api::governance-discussion.governance-discussion")
      .refreshData();
  },
  "0 0 * * *": async ({ strapi }) => {
    await strapi
      .service("api::defi-safety-report.defi-safety-report")
      .fetchReports();
    await strapi.service("api::tweet.tweet").getAndSetAllProfiles();
    await strapi.service("api::tweet.tweet").syncTwitterMedia();
    await strapi.service("api::helper.helper").syncDescriptions();
  },
};
