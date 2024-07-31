"use strict";

/**
 * submission router.
 */

const { createCoreRouter } = require("@strapi/strapi").factories;

const defaultRouter = createCoreRouter("api::submission.submission");
// const { customRouter } = require("../../../util/custom-router");
// const myExtraRoutes = [
//   {
//     method: "POST",
//     path: "/submissions/secure",
//     handler: "api::submission.submission.securePost",
//     config: {
//       auth: false,
//     },
//   },
// ];

module.exports = defaultRouter