'use strict';

/**
 * tag service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const excludeList = ['keep3r-network', 'akropolis'];

module.exports = createCoreService(
  'api::governance-discussion.governance-discussion',
  ({ strapi }) => ({
    async getProjectDiscussions({ discourse_url }) {
      const discussionsResponse = await fetch(`${discourse_url}/latest.json`);

      console.log('discussionsResponse', {
        url: `${discourse_url}/latest.json`,
        status: discussionsResponse.status,
      });

      return discussionsResponse.json();
    },
    async refreshData() {
      console.log(`Starting gov discussions refresh!`);
      const found = (
        await strapi.service('api::project.project').find({ pagination: { pageSize: 800 } })
      ).results.filter((project) => !!project.discourse_url);

      for (const project of found) {
        try {
          if (!excludeList.includes(project.slug)) {
            const discussions = await this.getProjectDiscussions({
              discourse_url: project.discourse_url,
            });

            const relevantDiscussions = discussions.topic_list.topics.slice(0, 5);

            const previousEntries = await strapi.db
              .query('api::governance-discussion.governance-discussion')
              .findMany({
                where: {
                  project_slug: project.slug,
                },
              });

            if (!previousEntries.length) {
              console.log(`creating discussions for ${project.slug}`);
              await strapi.entityService.create(
                'api::governance-discussion.governance-discussion',
                {
                  data: {
                    project_slug: project.slug,
                    discussions: relevantDiscussions,
                  },
                },
              );
            } else {
              console.log(`updating discussions for ${project.slug}`);
              await strapi.entityService.update(
                'api::governance-discussion.governance-discussion',
                previousEntries[0].id,
                {
                  data: {
                    project_slug: project.slug,
                    discussions: relevantDiscussions,
                  },
                },
              );
            }
          }
        } catch (e) {
          console.log(`Error in ${project.slug}`);
          console.log(e);
        }
      }
      console.log(`Done doing gov discussions refresh!`);
      return { success: true };
    },
    async byProjectSlug({ slug }) {
      if (excludeList.includes(slug)) {
        return [];
      }
      const discussions = await strapi.db
        .query('api::governance-discussion.governance-discussion')
        .findMany({
          where: {
            project_slug: slug,
          },
        });

      return discussions[0];
    },
    async allWithProject() {
      const discussions = await strapi.db
        .query('api::governance-discussion.governance-discussion')
        .findMany();

      for (const discussion of discussions) {
        const projects = await strapi.db.query('api::project.project').findMany({
          where: { slug: discussion.project_slug },
        });
        discussion.project = projects[0];
      }
      return {
        discussions: discussions,
      };
    },
  }),
);
