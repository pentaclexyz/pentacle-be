"use strict";

/**
 * helper service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::helper.helper", ({ strapi }) => ({
  async syncProject(project) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/projects/${project.slug}.md`
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService.update("api::project.project", project.id, {
      data: {
        description: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncPerson(person) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/people/${person.slug}.md`
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService.update("api::person.person", person.id, {
      data: {
        bio: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncSkill(skill) {
    const descriptionRes = await fetch(
      `${process.env.DESCRIPTION_SERVICE}/skills/${skill.slug}.md`
    );
    if (!descriptionRes.ok) {
      return {
        success: false,
        error: descriptionRes.statusText,
        status: descriptionRes.status,
      };
    }
    await strapi.entityService.update("api::skill.skill", skill.id, {
      data: {
        text: await descriptionRes.text(),
      },
    });
    return { success: true };
  },
  async syncDescriptions() {
    const projects = await strapi.db.query("api::project.project").findMany();
    const people = await strapi.db.query("api::person.person").findMany();
    const skills = await strapi.db.query("api::skill.skill").findMany();
    const totalLength = projects.length + people.length + skills.length;
    let i = 1;
    console.log("Starting to sync descriptions");
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
    const projects = await strapi.db.query("api::project.project").findMany();
    for (const project of projects) {
      if (project.github_url) {
        const github = project.github_url.split("/");
        const username = github[github.length - 1];

        const res = await (
          await fetch(`https://api.github.com/users/${username}`, {
            headers: {
              Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            },
          }).catch((e) => console.error(e))
        ).json().catch((e) => console.error(e));
        if (res?.id) {
          await strapi.entityService.update(
            "api::project.project",
            project.id,
            {
              data: {
                github_id: res.id,
              },
            }
          );
        }
      }
    }
    return { success: true };
  },
}));
