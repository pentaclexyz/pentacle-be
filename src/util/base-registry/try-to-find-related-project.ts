import { Strapi } from '@strapi/strapi';
import { BaseRegistryEntryResponseItem } from './types';
import { ID } from '@strapi/database/dist/types';

export const tryToFindRelatedProject = async ({
  strapi,
  baseRegistryEntry,
}: {
  strapi: Strapi;
  baseRegistryEntry: BaseRegistryEntryResponseItem;
}) => {
  const {
    content: { contract_address, target_url },
  } = baseRegistryEntry;
  const urlHostname = new URL(target_url).hostname;
  const project = await strapi.entityService?.findMany('api::project.project', {
    fields: ['contract_url', 'id', 'website_url'],
    limit: 1,
    filters: {
      $or: [
        { contract_url: { $contains: contract_address } },
        { website_url: { $contains: urlHostname } },
      ],
    },
  });
  return project as { website_url?: string; contract_url?: string; id: ID }[] | undefined;
};
