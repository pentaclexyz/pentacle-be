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
}));
