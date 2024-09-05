'use strict';

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::person.person');

// Customize the default router
const customRouter = (innerRouter, extraRoutes = []) => {
  let routes;
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = innerRouter.routes.concat(extraRoutes);
      return routes;
    },
  };
};

const extraRoutes = [
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
];

module.exports = customRouter(defaultRouter, extraRoutes);
