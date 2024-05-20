'use strict';

/**
 * media-kit service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::media-kit.media-kit');
