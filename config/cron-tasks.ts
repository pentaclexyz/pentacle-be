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
      await strapi.service('api::governance-proposal.governance-proposal').refreshData();
      await strapi.service('api::governance-discussion.governance-discussion').refreshData();
    },
    options: {
      rule: '0 */4 * * *',
    },
  },
  refetchDefiReports: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      await strapi.service('api::defi-safety-report.defi-safety-report').fetchReports();
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  fetchMissingTwitterProfiles: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      await strapi.service('api::tweet.tweet').getAndSetAllProfiles();
      await strapi.service('api::tweet.tweet').syncTwitterMedia();
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncContentFromMdFiles: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      await strapi.service('api::helper.helper').syncDescriptions();
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  syncGithubData: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      await strapi.service('api::helper.helper').migrateGithub();
    },
    options: {
      rule: '0 0 * * *',
    },
  },
  fetchAndUpdateAllBaseRegistryEntries: {
    task: async ({ strapi }: { strapi: Strapi }) => {
      await strapi
        .service('api::base-registry.base-registry-entry')
        .fetchAndUpdateAllBaseRegistryEntries();
    },
    options: {
      rule: '0 0 * * *',
    },
  },
} satisfies Record<string, Task>;
