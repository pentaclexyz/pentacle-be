"use strict";

/**
 * base-registry service.
 */

import {
  BASE_REGISTRY_API_BASE_URL,
  BASE_REGISTRY_API_ENDPOINTS,
  BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS,
} from "../../../constants/base-registry";
import { factories } from "@strapi/strapi";
import {
  BaseRegistryEntryResponse,
  BaseRegistryEntryResponseItem,
} from "../../../util/base-registry/types";
import { splitIntoChunks } from "../../../util/split-into-chunks";
import { ID } from "@strapi/database/dist/types";

const BATCH_SIZE = 100;

const { createCoreService } = factories;

const mapBaseResponseToStrapiResponse = (
  baseResponse: BaseRegistryEntryResponseItem
) => {
  return {
    base_registry_id: baseResponse.id,
    category: baseResponse.category,
    ...baseResponse.content,
  };
};

const getBaseRegistryEntries = async ({
  urlInstance,
  pageNumber,
}: {
  urlInstance: URL;
  pageNumber: number;
}) => {
  urlInstance.searchParams.set(
    BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS.page,
    pageNumber.toString()
  );
  console.log("urlInstance.toString()", urlInstance.toString());
  const response = await fetch(urlInstance.toString());
  const entriesResponse = (await response.json()) as BaseRegistryEntryResponse;
  return entriesResponse.data.map(mapBaseResponseToStrapiResponse);
};

//https://docs.base.org/docs/tools/registry-api/
const fetchAllBaseRegistryEntries = async () => {
  const baseRegistryEntriesApiUrl = new URL(
    `${BASE_REGISTRY_API_BASE_URL}/${BASE_REGISTRY_API_ENDPOINTS.entries}`
  );
  const maxEntriesPerPage = 200;
  let page = 1;
  const results: ReturnType<typeof mapBaseResponseToStrapiResponse>[] = [];

  baseRegistryEntriesApiUrl.searchParams.set(
    BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS.limit,
    maxEntriesPerPage.toString()
  );

  let lastBaseEntriesBatch = [];

  do {
    lastBaseEntriesBatch = await getBaseRegistryEntries({
      urlInstance: baseRegistryEntriesApiUrl,
      pageNumber: page,
    });

    results.push(...lastBaseEntriesBatch);
    page++;
  } while (lastBaseEntriesBatch.length >= maxEntriesPerPage);

  return results;
};

const baseRegistryService = createCoreService(
  "api::base-registry.base-registry-entry",
  ({ strapi }) => ({
    async fetchAllEntriesFromRegistry() {
      return fetchAllBaseRegistryEntries();
    },
    async fetchAndUpdateAllBaseRegistryEntries() {
      const allRegistryEntries = await (
        strapi.service(
          "api::base-registry.base-registry-entry"
        ) as BaseRegistryService
      ).fetchAllEntriesFromRegistry();

      // Split them in chunks to avoid hitting the database limit
      const chunks = splitIntoChunks(allRegistryEntries, BATCH_SIZE);

      let savedIds: ID[] = [];

      for (const chunk of chunks) {
        if (chunk.length > 0) {
          // Fetch existing entries from Strapi to know when to update and when to create. Since Strapi doesn't have UPSERT method
          const base_entity_ids = chunk.map((entry) => entry.base_registry_id);
          const existingIdsResponse =
            (await strapi.db
              ?.query("api::base-registry.base-registry-entry")
              .findMany({
                where: {
                  base_registry_id: {
                    $in: base_entity_ids,
                  },
                },
                select: ["base_registry_id", "id"],
              })) ?? [];

          const existingBaseRegistryIds = existingIdsResponse.map(
            (entity) => entity.base_registry_id
          );

          // Filter out entries that are not yet in strapi DB. For CREATE op
          const entriesToCreate = chunk.filter(
            (entity) =>
              !existingBaseRegistryIds.includes(entity.base_registry_id)
          );

          // Filter out entries that are already present in strapi DB. For UPDATE op
          const entriesToUpdate = chunk
            .filter((entity) =>
              existingBaseRegistryIds.includes(entity.base_registry_id)
            )
            .map((entity) => ({
              ...entity,
              id: existingIdsResponse.find(
                (e) => e.base_registry_id === entity.base_registry_id
              )?.id,
            }));

          // Create new entries
          if (entriesToCreate.length > 0) {
            const createdIds = await strapi.db
              ?.query("api::base-registry.base-registry-entry")
              .createMany({
                data: chunk,
              });

            savedIds = savedIds.concat(createdIds?.ids ?? []);
          }

          // Update existing new entries
          // TODO: Identify only the fields that need to be updated
          if (entriesToUpdate.length > 0) {
            for (const entry of entriesToUpdate) {
              const { id, ...data } = entry;
              const updatedDocument = await strapi.entityService?.update(
                "api::base-registry.base-registry-entry",
                id,
                { data }
              );
              if (updatedDocument?.id) {
                savedIds.push(updatedDocument.id);
              }
            }
          }
        }
      }

      return savedIds;
    },
  })
);

export default baseRegistryService;

export type BaseRegistryService = ReturnType<typeof baseRegistryService>;
