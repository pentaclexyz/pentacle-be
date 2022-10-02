"use strict";

/**
 * fave service.
 */
const { ethers } = require("ethers");
const { createCoreService } = require("@strapi/strapi").factories;
module.exports = createCoreService("api::fave.fave", ({ strapi }) => ({
  async addFave({ owner, item_id, signature }) {
    const signatureOwner = ethers.utils.verifyMessage(item_id, signature);
    if (signatureOwner === owner) {
      const [previousFave] = await strapi.entityService.findMany(
        "api::fave.fave",
        { filters: { item_id, owner, signature } }
      );
      if (previousFave) {
        return { sucess: false };
      }
      const data = {
        owner,
        item_id,
        signature,
      };
      const db_entry = await strapi.service("api::fave.fave").create({
        data,
      });
      return { success: true, data, db_entry };
    }
    return { sucess: false };
  },
  async removeFave({ owner, item_id, signature }) {
    const signatureOwner = ethers.utils.verifyMessage(item_id, signature);
    if (signatureOwner === owner) {
      const [previousFave] = await strapi.entityService.findMany(
        "api::fave.fave",
        { filters: { item_id, owner, signature } }
      );
      if (previousFave) {
        const data = {
          owner,
          item_id,
          signature,
        };
        const uuid = +item_id.split(":")[1];
        await strapi.service("api::fave.fave").delete(uuid);
        return { success: true, data };
      }
      return { sucess: false };
    }
    return { sucess: false };
  },
  async getByOwner({ owner, signature }) {
    const msg = "sign in to save your faves. in beta";
    const signatureOwner = ethers.utils.verifyMessage(msg, signature);
    if (signatureOwner === owner) {
      const previousFaves = await strapi.entityService.findMany(
        "api::fave.fave",
        { filters: { owner } }
      );
      return previousFaves;
    }
    return { sucess: false };
  },
}));
