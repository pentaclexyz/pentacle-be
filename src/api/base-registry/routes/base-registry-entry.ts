'use strict';

/**
 * base_registry_entry router.
 */

import { factories } from '@strapi/strapi';
import { customRouter } from '../../../util/custom-router';

const { createCoreRouter } = factories;

const defaultRouter = createCoreRouter('api::base-registry.base-registry-entry');

const customRoutes = [
  {
    method: 'GET',
    path: '/base-registry/fetch-all-entries-from-registry',
    handler: 'api::base-registry.base-registry-entry.fetchAllEntriesFromRegistry',
  },
  {
    method: 'GET',
    path: '/base-registry/remove-all-project-relations',
    handler: 'api::base-registry.base-registry-entry.removeAllProjectRelations',
  },
];

module.exports = customRouter(defaultRouter, customRoutes);
