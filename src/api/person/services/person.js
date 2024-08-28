'use strict';

/**
 * person service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::person.person', ({ strapi }) => ({
  // @TODO: move this into submission service
  async createSubmission({ formData, submissionId }) {
    const { eth_address, profile_img, profile_banner, ...rest } = formData;
    const person = await strapi.entityService.create('api::person.person', {
      data: {
        ...rest,
        twitter_img: profile_img,
        twitter_banner: profile_banner,
        created_by: eth_address,
        publishedAt: new Date(),
      },
    });
    const submission = await strapi.entityService.update(
      'api::person-submission.person-submission',
      parseInt(submissionId),
      { data: { status: 'approved' } },
    );
    return { person, submission };
  },
}));
