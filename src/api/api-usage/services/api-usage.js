'use strict';

/**
 * api-usage service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::api-usage.api-usage');
