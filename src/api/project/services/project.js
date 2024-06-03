"use strict";

/**
 * project service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::project.project", ({ strapi }) => ({
  async createSubmission({ formData, submissionId, ethAddress }) {
    const { eth_address, profile_img, profile_banner, ...rest } = formData;
    const newItem = await strapi.entityService.create("api::project.project", {
      data: {
        ...rest,
        twitter_img: profile_img,
        twitter_banner: profile_banner,
        created_by: ethAddress,
        publishedAt: new Date(),
      },
    });
    const deleted = await strapi.entityService.delete(
      "api::submission.submission",
      parseInt(submissionId)
    );
    return { newItem, deleted };
  },
  async getRelated(ctx) {
    const allProjects = await strapi.db.query("api::project.project").findMany({
      populate: {
        categories: true,
        sections: true,
      },
    });
    const { slug } = ctx.query;
    const thisProject = allProjects.find((proj) => proj.slug === slug);
    const categories = thisProject?.categories?.map(
      (category) => category.slug
    );
    const section = thisProject?.sections[0]?.slug || null;
    const filteredRelatedProjects =
      allProjects
        ?.filter((proj) => {
          return (
            proj.sections.some((_section) => _section.slug === section) &&
            proj.categories.some((_category) =>
              categories.includes(_category.slug)
            )
          );
        })
        .slice(0, 20) || [];
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
      }
    };
  },
}));
