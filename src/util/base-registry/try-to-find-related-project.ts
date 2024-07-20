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

  if (!contract_address && !target_url) {
    return undefined;
  }
  const urlHostname = new URL(target_url).hostname;
  const filters = {} as unknown as Record<string, unknown>;

  if (contract_address && urlHostname) {
    filters['$or'] = [
      { contract_url: { $contains: contract_address } },
      { website_url: { $contains: urlHostname } },
    ];
  } else {
    if (contract_address) {
      filters['contract_url'] = { $contains: contract_address };
    }
    if (urlHostname) {
      filters['website_url'] = { $contains: urlHostname };
    }
  }

  const project = await strapi.entityService?.findMany('api::project.project', {
    fields: ['contract_url', 'id', 'website_url'],
    limit: 1,
    //FIXME: Deal with the strapi types
    //@ts-ignore
    filters: filters,
  });
  return project as { website_url?: string; contract_url?: string; id: ID }[] | undefined;
};
