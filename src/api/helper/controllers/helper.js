'use strict';

/**
 *  helper controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::helper.helper', ({ strapi }) => ({
  async syncDescriptions() {
    const data = await strapi.service('api::helper.helper').syncDescriptions();
    return data;
  },
  async syncProject({ params }) {
    const slug = params.slug;
    const project = await strapi.db.query('api::project.project').findOne({ where: { slug } });
    const data = await strapi.service('api::helper.helper').syncProject(project);
    return data;
  },
  async syncPerson({ params }) {
    const slug = params.slug;
    const person = await strapi.db.query('api::person.person').findOne({ where: { slug } });
    const data = await strapi.service('api::helper.helper').syncPerson(person);
    return data;
  },
  async syncSkill({ params }) {
    const slug = params.slug;
    const skill = await strapi.db.query('api::skill.skill').findOne({ where: { slug } });
    const data = await strapi.service('api::helper.helper').syncSkill(skill);
    return data;
  },
  async migrateGithub() {
    const data = await strapi.service('api::helper.helper').migrateGithub();
    return data;
  },
  async processChains() {
    const data = await strapi.service('api::helper.helper').processChains();
    return data;
  },
  async checkHealth() {
    return { status: 'ok' };
  },
  async fetchBaseEcosystemProjects() {
    return await strapi.service('api::helper.helper').fetchBaseEcosystemProjects();
  },
}));
