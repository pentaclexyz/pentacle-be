"use strict";

/**
 * tag service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

module.exports = createCoreService(
  "api::governance-proposal.governance-proposal",
  ({ strapi }) => ({
    async getProjectProposals({ governance_url }) {
      const query = `
      query Proposals($first: Int!, $skip: Int!, $state: String!, $space: String, $space_in: [String], $author_in: [String], $title_contains: String, $space_verified: Boolean, $flagged: Boolean) {
        proposals(
          first: $first
          skip: $skip
          where: {space: $space, state: $state, space_in: $space_in, author_in: $author_in, title_contains: $title_contains, space_verified: $space_verified, flagged: $flagged}
        ) {
          id
          ipfs
          title
          body
          start
          end
          state
          author
          created
          choices
          space {
            id
            name
            members
            avatar
            symbol
            verified
            plugins
          }
          scores_state
          scores_total
          scores
          votes
          quorum
          symbol
          flagged
        }
      }
    `;
      const fetchParams = new URLSearchParams({
        query,
        variables: JSON.stringify({
          first: 12,
          skip: 0,
          space_in: [governance_url],
          state: "all",
          flagged: false,
          title_contains: "",
        }),
        operationName: "Proposals",
      });
      let { data } = await fetch(
        `https://hub.snapshot.org/graphql?${fetchParams}`
      ).then((res) => res.json());

      return data?.proposals;
    },
    async refreshData() {
      console.log(`Starting gov data refresh!`);
      const found = (
        await strapi
          .service("api::project.project")
          .find({ pagination: { pageSize: 800 } })
      ).results.filter((project) => !!project.governance_url);

      for (const project of found) {
        console.log(`getting proposals for ${project.name}`);
        const proposals = await this.getProjectProposals({
          governance_url: project.governance_url,
        });
        if (!proposals) {
          console.log(`no proposals for ${project.name}`);
          continue;
        }
        console.log(`found ${proposals.length} proposals for ${project.name}`);
        for (const proposal of proposals) {
          const previousEntries = await strapi.db
            .query("api::governance-proposal.governance-proposal")
            .findMany({
              where: {
                snapshot_id: proposal.id,
              },
            });

          if (!previousEntries.length) {
            console.log(`creating ${proposal.id}`);
            const { id, ...otherProps } = proposal;
            await strapi.entityService.create(
              "api::governance-proposal.governance-proposal",
              {
                data: {
                  ...otherProps,
                  governance_url: proposal.space.id,
                  title: proposal.title,
                  end_date: `${proposal.end}`,
                  state: proposal.state,
                  snapshot_id: proposal.id,
                },
              }
            );
          } else {
            console.log(`updating ${proposal.id}`);
            const { id, ...otherProps } = proposal;
            await strapi.entityService.update(
              "api::governance-proposal.governance-proposal",
              previousEntries[0].id,
              {
                data: {
                  ...otherProps,
                  governance_url: proposal.space.id,
                  title: proposal.title,
                  end_date: `${proposal.end}`,
                  state: proposal.state,
                  snapshot_id: proposal.id,
                },
              }
            );
          }
        }
      }
      console.log(`Done doing gov data refresh!`);
      return { success: true };
    },
    async getOrderedByEndDate() {
      const distance = (a, t) => Math.abs(t - a);
      const now = Math.floor(Date.now() / 1000);
      const previousEntries = await strapi.db
        .query("api::governance-proposal.governance-proposal")
        .findMany();

      const ordered = previousEntries.sort(
        (a, b) => distance(a.end, now) - distance(b.end, now)
      );
      const ret = [];
      ordered.forEach((item) => {
        if (!ret.find((it) => item.governance_url === it.governance_url)) {
          ret.push(item);
        }
      });

      for (const proposal of ret) {
        const proj = await strapi.db.query("api::project.project").findOne({
          where: {
            governance_url: proposal.governance_url,
          },
        });
        proposal.project = proj;
      }
      return ret;
    },
    async getByGovernanceUrl({ governance_url }) {
      const data = await strapi.db
        .query("api::governance-proposal.governance-proposal")
        .findMany({
          where: { governance_url },
        });

      return data;
    },
  })
);
