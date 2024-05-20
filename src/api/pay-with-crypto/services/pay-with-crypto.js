'use strict';

/**
 * pay-with-crypto service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::pay-with-crypto.pay-with-crypto');
