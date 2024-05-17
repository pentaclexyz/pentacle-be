"use strict";
const { verifyMessage } = require("viem");

/**
 *  project controller
 */

const { createCoreController } = require("@strapi/strapi").factories;
if (!process.env.WHITELISTED_ADDRESSES) {
  throw new Error("WHITELISTED_ADDRESSES env var is required");
}
const WHITELIST = process.env.WHITELISTED_ADDRESSES.split(",").filter(Boolean);
module.exports = createCoreController("api::project.project", ({ strapi }) => ({
  async createSubmission() {
    const ctx = strapi.requestContext.get();
    const {
      address,
      signature,
      data: formData,
      submissionId,
    } = ctx.request.body;

    if (!WHITELIST.includes(address)) {
      ctx.throw(400, "Address not whitelisted");
      return;
    }

    const isValid = await verifyMessage({
      address,
      message: "Sign this message to submit a project",
      signature,
    });

    if (!isValid) {
      ctx.throw(400, "Invalid signature");
      return;
    }

    const data = await strapi
      .service("api::project.project")
      .createSubmission({ formData, submissionId });

    return data;
  },
}));
