'use strict';
import { factories } from '@strapi/strapi';
import { verifyMessage } from 'viem';

/**
 *  project controller
 */

const { createCoreController } = factories;

if (!process.env.WHITELISTED_ADDRESSES) {
  throw new Error('WHITELISTED_ADDRESSES env var is required');
}

const WHITELIST = process.env.WHITELISTED_ADDRESSES.split(',')
  .filter(Boolean)
  .map((address) => address.toLowerCase());

export default createCoreController('api::project.project', ({ strapi }) => ({
  async getSlim(ctx) {
    const data = await strapi.service('api::project.project').getSlim(ctx);
    return data;
  },
  async getRelated(ctx) {
    const data = await strapi.service('api::project.project').getRelated(ctx);
    return data;
  },
  async getAttestations(ctx: { query: { refUID: string; attester: string } }): Promise<object> {
    const data = await strapi.service('api::project.project').getAttestations(ctx);
    return data;
  },
  async createSubmission() {
    const ctx = strapi.requestContext.get();
    const { address, signature, data: formData, submissionId, type } = (ctx!.request as any).body;

    if (!WHITELIST.includes(address.toLowerCase())) {
      ctx!.throw(400, 'Address not whitelisted');
      return;
    }

    const isValid = await verifyMessage({
      address,
      message: 'Sign this message to submit a project',
      signature,
    });

    if (!isValid) {
      ctx!.throw(400, 'Invalid signature');
      return;
    }

    const data = await strapi.service('api::project.project').createSubmission({
      formData: { ...formData, reviewed_by: address },
      submissionId,
      type,
    });

    return data;
  },
}));
