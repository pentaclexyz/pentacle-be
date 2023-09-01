"use strict";

/**
 *  helper controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::helper.helper", ({ strapi }) => ({
  async syncDescriptions() {
    const data = await strapi.service("api::helper.helper").syncDescriptions();
    return data;
  },
  async syncProject({ params }) {
    const slug = params.slug;
    const project = await strapi.db
      .query("api::project.project")
      .findOne({ slug });
    const data = await strapi
      .service("api::helper.helper")
      .syncProject(project);
    return data;
  },
  async syncPerson({ params }) {
    const slug = params.slug;
    const person = await strapi.db
      .query("api::person.person")
      .findOne({ slug });
    const data = await strapi.service("api::helper.helper").syncPerson(person);
    return data;
  },
  async syncSkill({ params }) {
    const slug = params.slug;
    const skill = await strapi.db.query("api::skill.skill").findOne({ slug });
    const data = await strapi.service("api::helper.helper").syncSkull(skill);
    return data;
  },
  async syncSkill({ params }) {},
}));
