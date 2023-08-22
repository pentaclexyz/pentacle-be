module.exports = {
  "0 */4 * * *": async ({ strapi }) => {
    await strapi
      .service("api::governance-proposal.governance-proposal")
      .refreshData();
    await strapi
      .service("api::governance-discussion.governance-discussion")
      .refreshData();
  },
  "0 0 * * *": async ({ strapi }) => {
    await strapi
      .service("api::defi-safety-report.defi-safety-report")
      .fetchReports();
    await strapi.service("api::tweet.tweet").getAndSetAllProfiles();
    await strapi.service("api::tweet.tweet").syncProfileBanners();

    const syncDescriptions = async () => {
      const projects = await strapi.db.query("api::project.project").findMany();
      const people = await strapi.db.query("api::person.person").findMany();
      const skills = await strapi.db.query("api::skill.skill").findMany();
      const totalLength = projects.length + people.length + skills.length;
      let i = 1;
      console.log("Starting to sync descriptions");
      for (const project of projects) {
        const descriptionRes = await fetch(
          `${process.env.DESCRIPTION_SERVICE}/projects/${project.slug}.md`
        );
        if (descriptionRes.ok) {
          await strapi.entityService.update(
            "api::project.project",
            project.id,
            {
              data: {
                description: await descriptionRes.text(),
              },
            }
          );
        }
        console.log(`${i}/${totalLength}`);
        i++;
      }
      for (const person of people) {
        const descriptionRes = await fetch(
          `${process.env.DESCRIPTION_SERVICE}/people/${person.slug}.md`
        );
        if (descriptionRes.ok) {
          await strapi.entityService.update("api::person.person", person.id, {
            data: {
              bio: await descriptionRes.text(),
            },
          });
        }
        console.log(`${i}/${totalLength}`);
        i++;
      }
      for (const skill of skills) {
        const descriptionRes = await fetch(
          `${process.env.DESCRIPTION_SERVICE}/skills/${skill.slug}.md`
        );
        if (descriptionRes.ok) {
          await strapi.entityService.update("api::skill.skill", skill.id, {
            data: {
              text: await descriptionRes.text(),
            },
          });
        }
        console.log(`${i}/${totalLength}`);
        i++;
      }
    };

    await syncDescriptions();
  },
};
