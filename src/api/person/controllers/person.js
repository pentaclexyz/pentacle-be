"use strict";

const {verifyMessage} = require("viem");
const { createCoreController } = require("@strapi/strapi").factories;

if (!process.env.WHITELISTED_ADDRESSES) {
  throw new Error("WHITELISTED_ADDRESSES env var is required");
}

const WHITELIST = process.env.WHITELISTED_ADDRESSES.split(",")
    .filter(Boolean)
    .map((address) => address.toLowerCase());

module.exports = createCoreController("api::person.person", ({ strapi }) => ({
  // Standard CRUD operations
  async find(ctx) {
    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const { data, meta } = await super.findOne(ctx);
    return { data, meta };
  },

  async create(ctx) {
    const { data, meta } = await super.create(ctx);
    return { data, meta };
  },

  async update(ctx) {
    const { data, meta } = await super.update(ctx);
    return { data, meta };
  },

  async delete(ctx) {
    const { data, meta } = await super.delete(ctx);
    return { data, meta };
  },

  // Custom createSubmission method
  async createSubmission() {
    const ctx = strapi.requestContext.get();
    const {
      address,
      signature,
      data: formData,
      submissionId,
    } = ctx.request.body;

    if (!WHITELIST.includes(address.toLowerCase())) {
      ctx.throw(400, "Address not whitelisted");
      return;
    }

    const isValid = await verifyMessage({
      address,
      message: "Sign this message to submit a person",
      signature,
    });

    if (!isValid) {
      ctx.throw(400, "Invalid signature");
      return;
    }

    const data = await strapi.service("api::person.person").createSubmission({
      formData: { ...formData, reviewed_by: address },
      submissionId,
    });

    return data;
  },
}));
