"use strict";

/**
 * project service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::project.project", ({ strapi }) => ({
  async createSubmission({ formData, submissionId }) {
    const newItem = await strapi.entityService.create("api::project.project", {
      data: { ...formData },
    });
    const deleted = await strapi.entityService.delete(
      "api::submission.submission",
      parseInt(submissionId)
    );
    console.log({ newItem, deleted });
    debugger;
    return newItem;
    // return await strapi.services.submission.create(data);
  },
}));
