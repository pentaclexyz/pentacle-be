import { Strapi } from '@strapi/strapi';

type TaskFn = (
  {
    strapi,
  }: {
    strapi: Strapi;
  },
  ...args: unknown[]
) => Promise<unknown>;

type Task = {
  task: TaskFn;
  options: {
    rule: string;
  };
};

export default {
  refreshGovernanceData: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START refreshGovernanceData');
        await strapi.service('api::governance-proposal.governance-proposal').refreshData();
        await strapi.service('api::governance-discussion.governance-discussion').refreshData();
        console.log('CRON: FINISH refreshGovernanceData');
      } catch (e) {
        console.error('CRON: Error refreshGovernanceData', e);
      }
    },
    options: {
      rule: '0 */4 * * *',
    },
  },
  refetchDefiReports: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START refetchDefiReports');
        await strapi.service('api::defi-safety-report.defi-safety-report').fetchReports();
        console.log('CRON: FINISH refetchDefiReports');
      } catch (e) {
        console.error('CRON: Error defi-safety-report:refetchDefiReports', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  fetchMissingTwitterProfileData: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START fetchMissingTwitterProfileData');
        await strapi.service('api::tweet.tweet').getAndSetAllProfiles();
        await strapi.service('api::tweet.tweet').syncTwitterMedia();
        console.log('CRON: FINISH fetchMissingTwitterProfileData');
      } catch (e) {
        console.error('CRON: Error fetchMissingTwitterProfileData', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncContentFromMdFiles: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START syncContentFromMdFiles');
        await strapi.service('api::helper.helper').syncDescriptions();
        console.log('CRON: FINISH syncContentFromMdFiles');
      } catch (e) {
        console.error('CRON: Error syncContentFromMdFiles', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncGithubData: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START syncGithubData');
        await strapi.service('api::helper.helper').migrateGithub();
        console.log('CRON: FINISH syncGithubData');
      } catch (e) {
        console.error('CRON: Error syncGithubData', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  fetchAndUpdateAllBaseRegistryEntries: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        console.log('CRON: START fetchAndUpdateAllBaseRegistryEntries');
        await strapi
          .service('api::base-registry.base-registry-entry')
          .fetchAndUpdateAllBaseRegistryEntries();
        console.log('CRON: FINISH fetchAndUpdateAllBaseRegistryEntries');
      } catch (e) {
        console.error('CRON: Error fetchAndUpdateAllBaseRegistryEntries', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
} satisfies Record<string, Task>;
