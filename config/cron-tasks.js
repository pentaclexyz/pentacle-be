module.exports = {
  "0 */4 * * *": async ({ strapi }) => {
    await strapi
      .service("api::governance-proposal.governance-proposal")
      .refreshData();
    // await strapi
    //   .service("api::treasury-account.treasury-account")
    //   .refreshData();
    await strapi
      .service("api::governance-discussion.governance-discussion")
      .refreshData();
  },
  "0 1 * * *": async ({ strapi }) => {
    await strapi
      .service("api::defi-safety-report.defi-safety-report")
      .fetchReports();
  },
  "0 8 * * *": async ({ strapi }) => {
    await strapi.service("api::tweet.tweet").getAndSetAllProfiles();
    await strapi.service("api::tweet.tweet").syncProfileBanners();
  },
};
