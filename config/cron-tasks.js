module.exports = {
    '*/30 * * * *': async ({ strapi }) => {
        await strapi
            .service("api::governance-proposal.governance-proposal")
            .refreshData();
    },
  };
   