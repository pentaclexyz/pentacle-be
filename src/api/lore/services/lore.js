'use strict';

/**
 * lore service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::lore.lore');
