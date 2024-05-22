'use strict';

/**
 * pay-with-crypto router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::pay-with-crypto.pay-with-crypto');
