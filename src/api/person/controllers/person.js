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
      const { address, signature, submissionId, data } = ctx.request.body;

      console.log('Received submission request:', { address, submissionId });
      console.log('Received data:', JSON.stringify(data, null, 2));

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

      if (!data) {
        console.log('Data is undefined');
        return ctx.badRequest('No data provided');
      }

      const sanitizedData = this.sanitizeFormData(data, address);
      console.log('Sanitized data:', JSON.stringify(sanitizedData, null, 2));

      if (!sanitizedData.name) {
        console.log('Name is missing in sanitized data');
        return ctx.badRequest('Name is required');
      }

      // Generate a slug from the name
      const slug = this.generateSlug(sanitizedData.name);
      sanitizedData.slug = slug;
      console.log('Generated slug:', slug);

      // Check for existing person by slug
      const existingPerson = await strapi.entityService.findMany('api::person.person', {
        filters: { slug: slug }
      });

      console.log('Existing person query result:', JSON.stringify(existingPerson, null, 2));

      if (existingPerson.length > 0) {
        console.log('Duplicate detected. Existing person:', JSON.stringify(existingPerson[0], null, 2));
        return ctx.badRequest('A person with this name already exists');
      }

      // Create the person
      const createdData = await strapi.entityService.create('api::person.person', {
        data: {
          ...sanitizedData,
          publishedAt: new Date(), // Publish immediately
        },
      });

      console.log('Submission created successfully');
      console.log('Created data:', JSON.stringify(createdData, null, 2));

      return ctx.send(createdData);
    } catch (error) {
      console.error('Error in createSubmission:', error);
      return ctx.badRequest(error.message || 'An error occurred during submission');
    }
  },

  sanitizeFormData(data, address) {
    if (!data) {
      console.log('Data is undefined in sanitizeFormData');
      return {};
    }

    const {
      name,
      bio,
      twitter,
      blog_url,
      website,
      github,
      farcaster_handle,
      twitter_img,
      twitter_banner,
      projects,
      tags,
      subject_expert_types,
      has_investment,
      skills,
      articles,
      glossary_items,
      lores,
      base_registry_entries
    } = data;

    console.log('Sanitizing data:', JSON.stringify(data, null, 2));

    return {
      name,
      bio,
      twitter,
      blog_url,
      website,
      github,
      farcaster_handle,
      twitter_img,
      twitter_banner,
      projects: this.formatRelation(projects),
      tags: this.formatRelation(tags),
      subject_expert_types: this.formatRelation(subject_expert_types),
      has_investment: this.formatRelation(has_investment),
      skills: this.formatRelation(skills),
      articles: this.formatRelation(articles),
      glossary_items: this.formatRelation(glossary_items),
      lores: this.formatRelation(lores),
      base_registry_entries: this.formatRelation(base_registry_entries),
      created_by: address,
      reviewed_by: address,
    };
  },

  formatRelation(ids) {
    if (Array.isArray(ids)) {
      return { connect: ids.map(id => ({ id })) };
    }
    return { connect: [] };
  },

  generateSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
  }
}));
