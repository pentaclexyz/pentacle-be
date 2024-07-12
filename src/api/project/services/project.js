"use strict";

/**
 * project service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::project.project", ({ strapi }) => ({
  async createSubmission({ formData, submissionId }) {
    const { eth_address, profile_img, profile_banner, ...rest } = formData;
    const project = await strapi.entityService.create("api::project.project", {
      data: {
        ...rest,
        eth_address,
        twitter_img: profile_img,
        twitter_banner: profile_banner,
        created_by: eth_address,
        publishedAt: new Date(),
      },
    });
    const submission = await strapi.entityService.update(
      "api::submission.submission",
      parseInt(submissionId),
      { data: { status: "approved" } }
    );
    return { project, submission };
  },
  async getRelated(ctx) {
    const thisProject = await strapi.db.query("api::project.project").findOne({
      where: { slug: ctx.query.slug },
      populate: {
        categories: true,
        sections: true,
      },
    });
    const categories = thisProject?.categories?.map(
      (category) => category.slug
    );
    const section = thisProject?.sections[0]?.slug || null;

    if (!categories || !section) {
      return {
        data: [],
      };
    }

    const filteredRelatedProjects = await strapi.db
      .query("api::project.project")
      .findMany({
        where: {
          slug: { $nei: ctx.query.slug },
          sections: {
            slug: section,
            categories: { slug: { $in: categories } },
          },
        },
        limit: 20,
        populate: {
          categories: true,
          sections: true,
        },
      });

    const filteredMappedRelatedProjects = filteredRelatedProjects.map(
      (project) => {
        const { id, ...rest } = project;
        return {
          id: id,
          attributes: {
            ...rest,
            sections: {
              data: project.sections.map((section) => {
                const { id, ...rest } = section;
                return {
                  id: id,
                  attributes: {
                    ...rest,
                  },
                };
              }),
            },
            categories: {
              data: project.categories.map((category) => {
                const { id, ...rest } = category;
                return {
                  id: id,
                  attributes: {
                    ...rest,
                  },
                };
              }),
            },
          },
        };
      }
    );
    return {
      data: filteredMappedRelatedProjects,
    };
  },
  async getSlim(ctx) {
    const populatedKeys = Object.keys(ctx.query?.populate || {});
    const opts = ctx.query?.filters?.slug
      ? { where: { slug: ctx.query.filters.slug } }
      : {};
    const data = await strapi.db.query("api::project.project").findOne({
      ...opts,
      populate: populatedKeys,
    });
    if (!data) {
      return {
        data: [],
        meta: {
          pagination: {
            total: 0,
            page: 1,
            pageSize: 1,
          },
        },
      };
    }
    for (const key of populatedKeys) {
      if (data[key]) {
        if (key === "treasury_wallets") {
          continue;
        }
        if (key === "risk_urls") {
          data[key] = data[key].map((item) => {
            const { id, ...rest } = item;
            return {
              id: id,
              attributes: {
                ...rest,
              },
            };
          });
          continue;
        }
        data[key] = {
          data: data[key].map((item) => {
            const { id, ...rest } = item;
            return {
              id: id,
              attributes: {
                ...rest,
              },
            };
          }),
        };
      }
    }
    const { id, ...rest } = data;
    return {
      data: [
        {
          id: id,
          attributes: {
            ...rest,
          },
        },
      ],
      meta: {
        pagination: {
          total: 1,
          page: 1,
          pageSize: 1,
        },
      },
    };
  },
}));
