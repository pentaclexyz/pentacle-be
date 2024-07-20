import { Strapi } from '@strapi/strapi';

export default {
  '0 */4 * * *': async ({ strapi }: { strapi: Strapi }) => {
    await strapi.service('api::governance-proposal.governance-proposal').refreshData();
    await strapi.service('api::governance-discussion.governance-discussion').refreshData();
  },
  // Once a day
  '0 0 * * *': async ({ strapi }: { strapi: Strapi }) => {
    try {
      await strapi.service('api::defi-safety-report.defi-safety-report').fetchReports();
    } catch (e) {
      console.error('CRON: Error fetchReports', e);
    }

    try {
      await strapi.service('api::tweet.tweet').getAndSetAllProfiles();
    } catch (e) {
      console.error('CRON: Error getAndSetAllProfiles', e);
    }

    try {
      await strapi.service('api::tweet.tweet').syncTwitterMedia();
    } catch (e) {
      console.error('CRON: Error syncTwitterMedia', e);
    }

    try {
      await strapi.service('api::helper.helper').syncDescriptions();
    } catch (e) {
      console.error('CRON: Error syncDescriptions', e);
    }

    try {
      await strapi.service('api::helper.helper').migrateGithub();
    } catch (e) {
      console.error('CRON: Error migrateGithub', e);
    }

    await strapi
      .service('api::base-registry.base-registry-entry')
      .fetchAndUpdateAllBaseRegistryEntries();
  },
};
