"use strict";
import {verifyMessage} from 'viem';

const { createCoreController } = require("@strapi/strapi").factories;

if (!process.env.WHITELISTED_ADDRESSES) {
  throw new Error("WHITELISTED_ADDRESSES env var is required");
}

const WHITELIST = process.env.WHITELISTED_ADDRESSES.split(",")
  .filter(Boolean)
  .map((address) => address.toLowerCase());
module.exports = createCoreController("api::person.person", ({ strapi }) => ({
  // @TODO: move this into submission service
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
    console.log('Signature validation result:', isValid);

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
