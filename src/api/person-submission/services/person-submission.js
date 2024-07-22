"use strict";

/**
 * person-submission service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::person-submission.person-submission");
