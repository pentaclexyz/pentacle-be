"use strict";

/**
 * tag service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::tag.tag", ({ strapi }) => ({
  async getSlim(ctx) {
    const populatedKeys = Object.keys(ctx.query?.populate || {});
    const opts = ctx.query?.filters?.slug
      ? { where: { slug: ctx.query.filters.slug } }
      : {};
    const data = await strapi.db.query("api::tag.tag").findOne({
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
