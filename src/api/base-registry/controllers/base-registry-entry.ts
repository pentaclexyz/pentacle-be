"use strict";

/**
 *  base_registry_entry controller
 */

import { factories } from "@strapi/strapi";
import { BaseRegistryService } from "../services/base-registry-entry";

const { createCoreController } = factories;

export default createCoreController(
  "api::base-registry.base-registry-entry",
  ({ strapi }) => ({
    // Fetch all entries from Base registry API
    async fetchAllEntriesFromRegistry() {
      const savedIds = await (
        strapi.service(
          "api::base-registry.base-registry-entry"
        ) as BaseRegistryService
      ).fetchAndUpdateAllBaseRegistryEntries();

      return savedIds;
    },
  })
);
