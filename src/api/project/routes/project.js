'use strict';

/**
 * helper router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::project.project', {
  config: {
    find: {
      middlewares: ['api::project.logger'],
    },
  },
});
const { customRouter } = require('../../../util/custom-router');
const myExtraRoutes = [
  {
    method: 'POST',
    path: '/projects/create-submission',
    handler: 'api::project.project.createSubmission',
  },
  {
    method: 'GET',
    path: '/projects-slim',
    handler: 'api::project.project.getSlim',
  },
  {
    method: 'GET',
    path: '/projects-related',
    handler: 'api::project.project.getRelated',
  },
  {
    method: 'GET',
    path: '/project-attestations',
    handler: 'api::project.project.getAttestations',
  },
];

module.exports = customRouter(defaultRouter, myExtraRoutes);
