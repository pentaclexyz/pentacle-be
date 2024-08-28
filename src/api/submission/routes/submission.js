'use strict';

/**
 * project-submission router.
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

const defaultRouter = createCoreRouter('api::submission.submission');

module.exports = defaultRouter;
