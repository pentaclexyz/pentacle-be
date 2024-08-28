import { factories } from '@strapi/strapi';
import { GetNonPopulatableKeys, GetValues } from '@strapi/types/dist/types/core/attributes';
import { UserV2 } from '../../../../types/twitter-api-types';
import { fetchTwitterProfile, getHandleFromTwitterUrl } from '../../../util/util';

const { createCoreService } = factories;

type Person = GetValues<'api::person.person', GetNonPopulatableKeys<'api::person.person'>>;
type Project = GetValues<'api::project.project', GetNonPopulatableKeys<'api::project.project'>>;

const checkTwitterImages = async (entity: Person | Project) => {
  const { twitter_banner, twitter_img } = entity;
  if (!twitter_banner || !twitter_img) {
    return true;
  }
  const bannerRes = await fetch(twitter_banner as any, {
    method: 'HEAD',
  });
  const pfpRes = await fetch(twitter_img as any, {
    method: 'HEAD',
  });
  if (bannerRes.status !== 200 || pfpRes.status !== 200) {
    return true;
  }
  return false;
};

module.exports = createCoreService('api::tweet.tweet', ({ strapi }) => ({
  async getUserTwitterInfo(username: string, query: string) {
    const { data, errors } = (await fetch(
      `https://api.twitter.com/2/users/by?usernames=${username}&${query}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        },
      },
    ).then((res) => res.json())) as { data: UserV2[]; errors: any };

    if (errors) {
      console.error(errors);
    }

    return data;
  },

  async getTwitterMedia(username: string) {
    console.log(`getting twitter banner for ${username}`);
    const possibleValues = [
      `https://twitter.com/${username}`,
      `http://twitter.com/${username}`,
      `https://www.twitter.com/${username}`,
      `http://www.twitter.com/${username}`,
      `https://x.com/${username}`,
      `http://x.com/${username}`,
      `https://www.x.com/${username}`,
      `http://www.x.com/${username}`,
    ];
    // TODO: get rid of this in favor of user object
    const projects: any = await strapi.entityService?.findMany('api::project.project', {
      filters: { twitter_url: { $in: possibleValues } },
    });
    const people: any = await strapi.entityService?.findMany('api::person.person', {
      filters: { twitter: { $in: possibleValues } },
    });

    if (!people || !projects || (!people.length && !projects.length)) {
      console.log(
        `no person or project found for ${username}. Check casing and make sure the twitter url is correct`,
      );
      return;
    }

    const needsUpdate = await Promise.all([
      ...people.map(checkTwitterImages),
      ...projects.map(checkTwitterImages),
    ]);

    if (!needsUpdate.some((item) => !!item)) {
      console.log(`no update needed for ${username}`);
      return { success: true, message: 'no update needed' };
    }

    const response = await fetchTwitterProfile(username);

    if (!response) {
      console.warn('Could not fetch twitter profile', username);
      return;
    }

    if (people) {
      for (const person of people) {
        await strapi.entityService?.update('api::person.person', person.id, {
          data: {
            twitter_img: response.profile_image_url_https?.replace('_normal', '_bigger'),
            twitter_banner: response.profile_banner_url?.replace('_normal', '_bigger'),
          } as any,
        });
      }
    }
    if (projects) {
      for (const project of projects) {
        await strapi.entityService?.update('api::project.project', project.id, {
          data: {
            twitter_img: response.profile_image_url_https,
            twitter_banner: response.profile_banner_url,
          } as any,
        });
      }
    }
    return { success: true };
  },
  async allToLowercase() {
    const projects: any = await strapi.entityService?.findMany('api::project.project');
    const people = await strapi.entityService?.findMany('api::person.person');

    if (!projects || !people) {
      throw new Error('Couldnt find projects or people');
    }

    console.log(`lowercasing ${projects.length + people.length} items`);

    for (const project of projects) {
      if (project.twitter_url) {
        const lowercaseName = project.twitter_url.toLowerCase();
        await strapi.entityService?.update('api::project.project', project.id, {
          data: {
            ...project,
            twitter_url: lowercaseName,
          },
        });
      }
    }
    for (const person of people as any) {
      if (person.twitter) {
        const lowercaseName = person.twitter.toLowerCase();
        await strapi.entityService?.update('api::person.person', person.id, {
          data: {
            ...person,
            twitter: lowercaseName,
          },
        });
      }
    }

    return { success: true };
  },
  async syncTwitterMedia() {
    const projects = await strapi.db?.query('api::project.project').findMany();
    const people = await strapi.db?.query('api::person.person').findMany();
    if (!projects || !people) {
      throw new Error('Couldnt find projects or people');
    }
    for (const project of projects) {
      if (!project.twitter_url) {
        continue;
      }
      const handle = getHandleFromTwitterUrl(project.twitter_url).replaceAll('/', '');
      await this.getTwitterMedia(handle);
    }
    for (const person of people) {
      if (!person.twitter) {
        continue;
      }
      const handle = getHandleFromTwitterUrl(person.twitter).replaceAll('/', '');
      await this.getTwitterMedia(handle);
    }
    return { success: true };
  },
}));
