'use strict';
import { kebabCase } from 'lodash';
import chains from 'viem/chains';
import { Strapi } from '@strapi/strapi';
import { factories } from '@strapi/strapi';
import { GetNonPopulatableKeys, GetValues } from '@strapi/types/dist/types/core/attributes';
import { GithubUser } from '../../../../types/github-api-types';
import { BaseEcosystem } from '../../../../types/base-ecosystem';
import { mapBaseEcosystemTagToWoTag } from '../../../util/util';
import { isTruthy } from '../../../util/is-truthy';
import { fetchImageAndUploadToFilebase } from '../../../util/upload-to-filebase';

const findExistingBaseEcosystemProject = async (
  strapi: Strapi,
  baseEcosystemProject: BaseEcosystem,
) => {
  const ecosystemProjectUrlString =
    baseEcosystemProject.url && !baseEcosystemProject.url.includes('http')
      ? `https://${baseEcosystemProject.url}`
      : baseEcosystemProject.url;
  const url = ecosystemProjectUrlString ? new URL(ecosystemProjectUrlString) : undefined;

  const filters: Record<any, any> = {
    $or: [
      { name: { $eqi: baseEcosystemProject.name, $notNull: true } },
      { slug: kebabCase(baseEcosystemProject.name.toLowerCase()) },
    ],
  };

  if (url) {
    filters['$or'].push({ website_url: { $contains: url.hostname, $notNull: true } });
  }

  const projects = await strapi.entityService?.findMany('api::project.project', {
    fields: ['name', 'website_url'],
    limit: 1,
    //FIXME: Deal with the strapi types
    //@ts-ignore
    filters: filters,
  });

  return !!projects && !!projects?.[0]?.name;
};

/**
 * helper service.
 */

const { createCoreService } = factories;

type Project = GetValues<'api::project.project', GetNonPopulatableKeys<'api::project.project'>>;
type Person = GetValues<'api::person.person', GetNonPopulatableKeys<'api::person.person'>>;
type Skill = GetValues<'api::skill.skill', GetNonPopulatableKeys<'api::skill.skill'>>;

export default createCoreService('api::helper.helper', ({ strapi }) => ({
  async processChains() {
    const names = Object.keys(chains) as Array<keyof typeof chains>;
    for (const key of names) {
      const chain = chains[key];
      const {
        name,
        nativeCurrency: { symbol },
      } = chain;
      const slug = kebabCase(name);
      const existing = await strapi.db?.query('api::chain.chain').findOne({ where: { slug } });
      if (existing) {
        await strapi.entityService?.update('api::chain.chain', existing.id, {
          data: {
            name,
            ticker: symbol,
            evm_chain_id: `${chain.id}`,
          },
        });
      } else {
        await strapi.entityService?.create('api::chain.chain', {
          data: {
            name,
            slug,
            ticker: symbol,
            evm_chain_id: `${chain.id}`,
          },
        });
      }
    }
    return { success: true };
  },
  async syncProject(project: Project) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/projects/${project.slug}.md`,
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService?.update('api::project.project', project.id, {
      data: {
        description: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncPerson(person: Person) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/people/${person.slug}.md`,
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService?.update('api::person.person', person.id, {
      data: {
        bio: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncSkill(skill: Skill) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/skills/${skill.slug}.md`,
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService?.update('api::skill.skill', skill.id, {
      data: {
        text: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncDescriptions() {
    //TODO: Ideally need to split this into batches using offset and limit props https://docs.strapi.io/dev-docs/api/query-engine/order-pagination#pagination
    const projects: Project[] | undefined = await strapi.db
      ?.query('api::project.project')
      .findMany();
    const people: Person[] | undefined = await strapi.db?.query('api::person.person').findMany();
    const skills: Skill[] | undefined = await strapi.db?.query('api::skill.skill').findMany();
    const totalLength = (projects?.length || 0) + (people?.length || 0) + (skills?.length || 0);
    let i = 1;
    if (projects) {
      console.log('Starting to sync descriptions');
      for (const project of projects) {
        await this.syncProject(project);
        console.log(`${i}/${totalLength}`);
        i++;
      }
    }

    if (people) {
      for (const person of people) {
        await this.syncPerson(person);
        console.log(`${i}/${totalLength}`);
        i++;
      }
    }

    if (skills) {
      for (const skill of skills) {
        await this.syncSkill(skill);
        console.log(`${i}/${totalLength}`);
        i++;
      }
    }
  },
  async migrateGithub() {
    const projects: Project[] | undefined = await strapi.db
      ?.query('api::project.project')
      .findMany({
        where: {
          github_url: {
            $notNull: true,
          },
        },
      });
    let i = 1;
    console.log('Starting to migrate github data');
    const filtered = projects?.filter((p) => p.github_url) || [];
    for (const project of filtered) {
      const github = project.github_url?.split('/');
      if (!github) {
        continue;
      }
      const username = github[github.length - 1];

      try {
        const res = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        });
        const githubUser = (await res.json()) as GithubUser | undefined;

        if (githubUser?.id) {
          await strapi.entityService?.update('api::project.project', project.id, {
            data: {
              github_id: `${githubUser.id}`,
              github_created_at: githubUser.created_at,
            },
          });
        }
      } catch (e: any) {
        console.error(e);
      }

      console.log(`${i}/${filtered.length} done`);
      i++;
    }
    return { success: true };
  },
  async fetchBaseEcosystemProjects() {
    const response = await fetch(
      'https://raw.githubusercontent.com/base-org/web/master/apps/web/src/data/ecosystem.json',
    );
    const responseText = await response.text();
    const baseEcosystemList = JSON.parse(responseText) as BaseEcosystem[];

    if (baseEcosystemList) {
      // Get Base chain entity to get it's ID
      const strapiChains = await strapi.entityService?.findMany('api::chain.chain', {
        filters: { name: 'Base' },
      });

      const strapiChain = strapiChains && Array.isArray(strapiChains) ? strapiChains?.[0] : null;

      if (!strapiChain) {
        throw new Error('Base chain not found');
      }

      for (const baseEcosystemItem of baseEcosystemList) {
        const isExistingProject = await findExistingBaseEcosystemProject(strapi, baseEcosystemItem);
        if (!isExistingProject) {
          const tags = baseEcosystemItem.tags.map(mapBaseEcosystemTagToWoTag).filter(isTruthy);
          const strapiTags = await strapi.entityService?.findMany('api::tag.tag', {
            filters: {
              slug: {
                $in: tags,
              },
            },
          });

          const tagIds = strapiTags?.map((tag) => tag.id);
          const baseEcosystemGithubImageUrl =
            baseEcosystemItem.imageUrl && baseEcosystemItem.imageUrl.startsWith('/')
              ? `https://raw.githubusercontent.com/base-org/web/master/apps/web/public${baseEcosystemItem.imageUrl}`
              : baseEcosystemItem.imageUrl || undefined;
          const ipfsImageUrl = baseEcosystemGithubImageUrl
            ? await fetchImageAndUploadToFilebase(baseEcosystemGithubImageUrl)
            : undefined;

          await strapi.entityService?.create('api::project.project', {
            data: {
              name: baseEcosystemItem.name,
              website_url: baseEcosystemItem.url,
              description: baseEcosystemItem.description,
              publishedAt: new Date(),
              slug: kebabCase(baseEcosystemItem.name.toLowerCase()),
              twitter_img: ipfsImageUrl ?? undefined,
              tags: {
                connect: tagIds || [],
              },
              chain: {
                connect: [{ id: strapiChain.id }],
              },
            },
          });
        }
      }
    }
  },
}));
