'use strict';

/**
 *  base_registry_entry controller
 */

import { factories } from '@strapi/strapi';
import { BaseRegistryService } from '../services/base-registry-entry';

const { createCoreController } = factories;

export default createCoreController('api::base-registry.base-registry-entry', ({ strapi }) => ({
  // Fetch all entries from Base registry API
  async fetchAllEntriesFromRegistry() {
    const savedIds = await (
      strapi.service('api::base-registry.base-registry-entry') as BaseRegistryService
    ).fetchAndUpdateAllBaseRegistryEntries();

    return savedIds;
  },
  async removeAllProjectRelations() {
    const allEntries = await strapi.entityService?.findMany(
      'api::base-registry.base-registry-entry',
      { populate: ['project'], fields: ['id'] },
    );

    //@ts-ignore
    for (const entry of allEntries) {
      if (!!entry?.project?.id) {
        await strapi.entityService?.update('api::base-registry.base-registry-entry', entry.id, {
          data: {
            //@ts-ignore
            project: {
              disconnect: [entry.project.id],
            },
          },
          populate: ['project'],
        });
      }
    }

    return true;
  },
}));
