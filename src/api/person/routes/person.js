'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::person.person');

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
    }
  ],
};
