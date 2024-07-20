'use strict';

/**
 * base-registry service.
 */

import {
  BASE_CATEGORY_TO_STRAPI_SECTION_MAPPING,
  BASE_REGISTRY_API_BASE_URL,
  BASE_REGISTRY_API_ENDPOINTS,
  BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS,
} from '../../../constants/base-registry';
import { factories, Strapi } from '@strapi/strapi';
import {
  BaseRegistryEntryResponse,
  BaseRegistryEntryResponseItem,
} from '../../../util/base-registry/types';
import { splitIntoChunks } from '../../../util/split-into-chunks';
import { ID } from '@strapi/database/dist/types';
import { tryToFindRelatedProject } from '../../../util/base-registry/try-to-find-related-project';

const BATCH_SIZE = 100;

const { createCoreService } = factories;

const mapBaseResponseToStrapiResponse = (baseResponse: BaseRegistryEntryResponseItem) => {
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
  urlInstance.searchParams.set(BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS.page, pageNumber.toString());
  const response = await fetch(urlInstance.toString());
  const entriesResponse = (await response.json()) as BaseRegistryEntryResponse;
  const relations = await getBaseRegistryEntryRelations({
    baseRegistryEntryResponseItems: entriesResponse.data,
    strapi,
  });
  const mappedEntities = entriesResponse.data.map(mapBaseResponseToStrapiResponse);
  return { relations, mappedEntities };
};

type StrapiRelation = {
  entryBaseId: string;
  relations: {
    chain: { connect: { id: ID }[] };
    sections?: { connect: { id: ID }[] };
    project?: { connect: { id: ID }[] };
  };
};

const getBaseRegistryEntryRelations = async ({
  baseRegistryEntryResponseItems,
  strapi,
}: {
  baseRegistryEntryResponseItems: BaseRegistryEntryResponseItem[];
  strapi: Strapi;
}) => {
  const relations: StrapiRelation[] = [];
  const strapiChain = (
    await strapi.entityService?.findMany('api::chain.chain', { filters: { name: 'Base' } })
  )?.[0];
  for (const baseRegistryEntry of baseRegistryEntryResponseItems) {
    const projectRelation = {
      entryBaseId: baseRegistryEntry.id,
      relations: {},
    } as StrapiRelation;
    if (strapiChain) {
      projectRelation.relations = { chain: { connect: [{ id: strapiChain.id }] } };
    }
    const project = (await tryToFindRelatedProject({ strapi, baseRegistryEntry }))?.[0];
    if (project) {
      projectRelation.relations.project = { connect: [{ id: project.id }] };
    }

    const strapiSectionSlug = BASE_CATEGORY_TO_STRAPI_SECTION_MAPPING[baseRegistryEntry.category];
    const strapiSection = (
      await strapi.entityService?.findMany('api::section.section', {
        filters: { slug: strapiSectionSlug },
      })
    )?.[0];
    if (strapiSection) {
      projectRelation.relations.sections = { connect: [{ id: strapiSection.id }] };
    }

    relations.push(projectRelation);
  }

  return relations;
};

//https://docs.base.org/docs/tools/registry-api/
const fetchAllBaseRegistryEntries = async () => {
  const baseRegistryEntriesApiUrl = new URL(
    `${BASE_REGISTRY_API_BASE_URL}/${BASE_REGISTRY_API_ENDPOINTS.entries}`,
  );
  const maxEntriesPerPage = 200;
  let page = 1;
  const results: ReturnType<typeof mapBaseResponseToStrapiResponse>[] = [];
  const relationsResults: StrapiRelation[] = [];

  baseRegistryEntriesApiUrl.searchParams.set(
    BASE_REGISTRY_API_ENTRIES_QUERY_PARAMS.limit,
    maxEntriesPerPage.toString(),
  );

  let lastBaseEntriesBatch = [];

  do {
    const { mappedEntities, relations } = await getBaseRegistryEntries({
      urlInstance: baseRegistryEntriesApiUrl,
      pageNumber: page,
    });

    relationsResults.push(...relations);
    lastBaseEntriesBatch = mappedEntities;

    results.push(...lastBaseEntriesBatch);
    page++;
  } while (lastBaseEntriesBatch.length >= maxEntriesPerPage);

  return { results, relationsResults };
};

const baseRegistryService = createCoreService(
  'api::base-registry.base-registry-entry',
  ({ strapi }) => ({
    async fetchAllEntriesFromRegistry() {
      return fetchAllBaseRegistryEntries();
    },
    async addMissingRelationsToBaseRegistryEntries(
      baseEntityIds: string[],
      relationsResults: StrapiRelation[],
    ) {
      const updatedEntities =
        (await strapi.db?.query('api::base-registry.base-registry-entry').findMany({
          where: {
            base_registry_id: {
              $in: baseEntityIds,
            },
          },
          select: ['base_registry_id', 'id'],
          populate: ['chain', 'project', 'sections'],
        })) ?? [];

      if (updatedEntities.length > 0) {
        for (const entity of updatedEntities) {
          const entityNewRelations = relationsResults.find(
            (relation) => relation.entryBaseId === entity.base_registry_id,
          );
          const missingRelations: Record<string, { connect: { id: ID }[] }> = {};
          let hasNewRelations = false;
          if (!entity.chain?.id && entityNewRelations?.relations.chain) {
            missingRelations.chain = entityNewRelations.relations.chain;
            hasNewRelations = true;
          }
          if (!entity.project?.id && entityNewRelations?.relations.project) {
            missingRelations.project = entityNewRelations.relations.project;
            hasNewRelations = true;
          }
          if (
            (!entity.sections || !entity.sections?.[0]?.id) &&
            entityNewRelations?.relations.sections
          ) {
            missingRelations.sections = entityNewRelations.relations.sections;
            hasNewRelations = true;
          }

          if (hasNewRelations) {
            await strapi.entityService?.update(
              'api::base-registry.base-registry-entry',
              entity.id,
              {
                data: missingRelations,
              },
            );
          }
        }
      }
    },
    async fetchAndUpdateAllBaseRegistryEntries() {
      const { results: allRegistryEntries, relationsResults } = await (
        strapi.service('api::base-registry.base-registry-entry') as BaseRegistryService
      ).fetchAllEntriesFromRegistry();

      // Split them in chunks to avoid hitting the database limit
      const chunks = splitIntoChunks(allRegistryEntries, BATCH_SIZE);

      let savedIds: ID[] = [];

      for (const chunk of chunks) {
        if (chunk.length > 0) {
          // Fetch existing entries from Strapi to know when to update and when to create. Since Strapi doesn't have UPSERT method
          const base_entity_ids = chunk.map((entry) => entry.base_registry_id);
          const existingIdsResponse =
            (await strapi.db?.query('api::base-registry.base-registry-entry').findMany({
              where: {
                base_registry_id: {
                  $in: base_entity_ids,
                },
              },
              select: ['base_registry_id', 'id'],
            })) ?? [];

          const existingBaseRegistryIds = existingIdsResponse.map(
            (entity) => entity.base_registry_id,
          );

          // Filter out entries that are not yet in strapi DB. For CREATE op
          const entriesToCreate = chunk.filter(
            (entity) => !existingBaseRegistryIds.includes(entity.base_registry_id),
          );

          // Filter out entries that are already present in strapi DB. For UPDATE op
          const entriesToUpdate = chunk
            .filter((entity) => existingBaseRegistryIds.includes(entity.base_registry_id))
            .map((entity) => ({
              ...entity,
              id: existingIdsResponse.find((e) => e.base_registry_id === entity.base_registry_id)
                ?.id,
            }));

          // Create new entries
          if (entriesToCreate.length > 0) {
            const createdIds = await strapi.db
              ?.query('api::base-registry.base-registry-entry')
              .createMany({
                data: entriesToCreate,
              });

            savedIds = savedIds.concat(createdIds?.ids ?? []);
          }

          // Update existing new entries
          // TODO: Identify only the fields that need to be updated
          if (entriesToUpdate.length > 0) {
            for (const entry of entriesToUpdate) {
              const { id, ...data } = entry;
              const updatedDocument = await strapi.entityService?.update(
                'api::base-registry.base-registry-entry',
                id,
                { data },
              );
              if (updatedDocument?.id) {
                savedIds.push(updatedDocument.id);
              }
            }
          }

          // Add missing relations if needed
          await (
            strapi.service('api::base-registry.base-registry-entry') as BaseRegistryService
          ).addMissingRelationsToBaseRegistryEntries(base_entity_ids, relationsResults);
        }
      }

      return savedIds;
    },
  }),
);

export default baseRegistryService;

export type BaseRegistryService = ReturnType<typeof baseRegistryService>;
