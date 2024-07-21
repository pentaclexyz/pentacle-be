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
        await strapi.service('api::governance-proposal.governance-proposal').refreshData();
        await strapi.service('api::governance-discussion.governance-discussion').refreshData();
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
        await strapi.service('api::defi-safety-report.defi-safety-report').fetchReports();
      } catch (e) {
        console.error('CRON: Error defi-safety-report:refetchDefiReports', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  fetchMissingTwitterProfiles: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        await strapi.service('api::tweet.tweet').getAndSetAllProfiles();
        await strapi.service('api::tweet.tweet').syncTwitterMedia();
      } catch (e) {
        console.error('CRON: Error fetchMissingTwitterProfiles', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncContentFromMdFiles: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        await strapi.service('api::helper.helper').syncDescriptions();
      } catch (e) {
        console.error('CRON: Error syncDescriptions', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncGithubData: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      try {
        await strapi.service('api::helper.helper').migrateGithub();
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
        await strapi
          .service('api::base-registry.base-registry-entry')
          .fetchAndUpdateAllBaseRegistryEntries();
      } catch (e) {
        console.error('CRON: Error fetchAndUpdateAllBaseRegistryEntries', e);
      }
    },
    options: {
      rule: '0 0 * * *',
    },
  },
} satisfies Record<string, Task>;
