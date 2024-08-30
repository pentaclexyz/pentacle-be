// File: src/api/person/routes/custom-person.js

module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/person/create-submission',
      handler: 'person.createSubmission',
      config: {
        policies: [],
        middlewares: [],
        auth: false, // Set to true if authentication is required
      },
    },
  ],
};


// File: src/api/person/controllers/person.js

'use strict';

const { createCoreController } = require('@strapi/strapi').factories;
const { verifyMessage } = require('viem');

if (!process.env.WHITELISTED_ADDRESSES) {
  throw new Error('WHITELISTED_ADDRESSES env var is required');
}

const WHITELIST = process.env.WHITELISTED_ADDRESSES.split(',')
    .filter(Boolean)
    .map((address) => address.toLowerCase());

module.exports = createCoreController('api::person.person', ({ strapi }) => ({
  async createSubmission(ctx) {
    try {
      const { address, signature, data: formData, submissionId } = ctx.request.body;

      console.log('Received submission request:', { address, submissionId });
      console.log('Received formData:', JSON.stringify(formData, null, 2));

      if (!WHITELIST.includes(address.toLowerCase())) {
        console.log('Address not whitelisted:', address.toLowerCase());
        return ctx.badRequest('Address not whitelisted');
      }

      const isValid = await verifyMessage({
        address,
        message: 'Sign this message to submit a person',
        signature,
      });

      console.log('Signature validation result:', isValid);

      if (!isValid) {
        return ctx.badRequest('Invalid signature');
      }

      // Sanitize and prepare the data
      const sanitizedData = this.sanitizeFormData(formData, address);
      console.log('Sanitized formData:', JSON.stringify(sanitizedData, null, 2));

      // Verify related entities
      try {
        await this.verifyRelatedEntities(sanitizedData);
      } catch (verifyError) {
        console.error('Error verifying related entities:', verifyError);
        return ctx.badRequest(verifyError.message);
      }

      const data = await strapi.entityService.create('api::person.person', {
        data: sanitizedData,
        populate: ['projects', 'tags'],
      });

      console.log('Submission created successfully');

      return ctx.send(data);
    } catch (error) {
      console.error('Error in createSubmission:', error);
      return ctx.badRequest(error.message || 'An error occurred during submission');
    }
  },

  // ... rest of the controller methods ...
}));
