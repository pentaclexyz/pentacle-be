'use strict';
import { kebabCase } from 'lodash';
import chains from 'viem/chains';

/**
 * helper service.
 */

import { factories } from '@strapi/strapi';

const { createCoreService } = factories;

export default createCoreService('api::helper.helper', ({ strapi }) => ({
  async processChains() {
    const names = Object.keys(chains);
    for (const key of names) {
      const chain = chains[key];
      const {
        name,
        nativeCurrency: { symbol },
      } = chain;
      const slug = kebabCase(name);
      const existing = await strapi.db.query('api::chain.chain').findOne({ where: { slug } });
      if (existing) {
        await strapi.entityService.update('api::chain.chain', existing.id, {
          data: {
            name,
            ticker: symbol,
            evm_chain_id: `${chain.id}`,
          },
        });
      } else {
        await strapi.entityService.create('api::chain.chain', {
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
  async syncProject(project) {
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
    await strapi.entityService.update('api::project.project', project.id, {
      data: {
        description: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncPerson(person) {
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
    await strapi.entityService.update('api::person.person', person.id, {
      data: {
        bio: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncSkill(skill) {
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
    await strapi.entityService.update('api::skill.skill', skill.id, {
      data: {
        text: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncDescriptions() {
    //TODO: Ideally need to split this into batches using offset and limit props https://docs.strapi.io/dev-docs/api/query-engine/order-pagination#pagination
    const projects = await strapi.db.query('api::project.project').findMany();
    const people = await strapi.db.query('api::person.person').findMany();
    const skills = await strapi.db.query('api::skill.skill').findMany();
    const totalLength = projects.length + people.length + skills.length;
    let i = 1;
    console.log('Starting to sync descriptions');
    for (const project of projects) {
      await this.syncProject(project);
      console.log(`${i}/${totalLength}`);
      i++;
    }
    for (const person of people) {
      await this.syncPerson(person);
      console.log(`${i}/${totalLength}`);
      i++;
    }
    for (const skill of skills) {
      await this.syncSkill(skill);
      console.log(`${i}/${totalLength}`);
      i++;
    }
  },
  async migrateGithub() {
    const projects = await strapi.db.query('api::project.project').findMany({
      where: {
        github_url: {
          $notNull: true,
        },
      },
    });
    let i = 1;
    console.log('Starting to migrate github data');
    const filtered = projects.filter((p) => p.github_url);
    for (const project of filtered) {
      const github = project.github_url.split('/');
      const username = github[github.length - 1];

      const res = await (
        await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          },
        }).catch((e) => console.error(e))
      )
        .json()
        .catch((e) => console.error(e));
      if (res?.id) {
        await strapi.entityService.update('api::project.project', project.id, {
          data: {
            github_id: `${res.id}`,
            github_created_at: res.created_at,
          },
        });
      }
      console.log(`${i}/${filtered.length} done`);
      i++;
    }
    return { success: true };
  },
}));
