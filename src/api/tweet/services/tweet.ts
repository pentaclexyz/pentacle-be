import qs from 'qs';
import fs from 'fs';
import { join } from 'path';
import { fetchTwitterProfile } from '../../../util/util';
import { factories } from '@strapi/strapi';
import { UserV2 } from '../../../../types/twitter-api-types';
import { GetNonPopulatableKeys, GetValues } from '@strapi/types/dist/types/core/attributes';

const { createCoreService } = factories;

// if (!String.prototype.replaceAll) {
//   String.prototype.replaceAll = function (str, newStr) {
//     // If a regex pattern
//     if (Object.prototype.toString.call(str).toLowerCase() === '[object regexp]') {
//       return this.replace(str, <string>newStr);
//     }
//
//     // If a string
//     return this.replace(new RegExp(str, 'g'), <string>newStr);
//   };
// }

function sliceIntoChunks<T>(arr: T[], chunkSize: number) {
  const res: T[][] = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

const getHandleFromTwitterUrl = (str = '') =>
  (str || '')
    .replace('https://twitter.com/', '')
    .replace('http://twitter.com/', '')
    .replace('https://www.twitter.com/', '');

type Person = GetValues<'api::person.person', GetNonPopulatableKeys<'api::person.person'>>;
type Project = GetValues<'api::project.project', GetNonPopulatableKeys<'api::project.project'>>;

const checkTwitterImages = async (entity: Person | Project) => {
  const { twitter_banner, twitter_img } = entity;
  if (!twitter_banner || !twitter_img) {
    return true;
  }
  const bannerRes = await fetch(twitter_banner, {
    method: 'HEAD',
  });
  const pfpRes = await fetch(twitter_img, {
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
    const projects = await strapi.entityService?.findMany('api::project.project', {
      filters: { twitter_url: { $in: possibleValues } },
    });
    const people = await strapi.entityService?.findMany('api::person.person', {
      filters: { twitter: { $in: possibleValues } },
    });

    if (!people || !projects || (!people.length && !projects.length)) {
      console.log(
        `no person or project found for ${username}. Check casing and make sure the twitter url is correct`,
      );
      return {
        error: `no person or project found for ${username}. Check casing and make sure the twitter url is correct`,
      };
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
      return {
        error: 'Could not fetch twitter profile ' + username,
      };
    }

    if (people) {
      for (const person of people) {
        await strapi.entityService?.update('api::person.person', person.id, {
          data: {
            twitter_img: response.profile_image_url_https?.replace('_normal', '_bigger'),
            twitter_banner: response.profile_banner_url?.replace('_normal', '_bigger'),
          },
        });
      }
    }
    if (projects) {
      for (const project of projects) {
        await strapi.entityService?.update('api::project.project', project.id, {
          data: {
            twitter_img: response.profile_image_url_https,
            twitter_banner: response.profile_banner_url,
          },
        });
      }
    }
    return { success: true };
  },

  async getPinnedTweetIdByUsername(userName: string) {
    const query = qs.stringify({
      expansions: 'pinned_tweet_id',
    });
    const twitterInfo = await this.getUserTwitterInfo(userName, query);
    const pinnedTweetId = twitterInfo[0].pinned_tweet_id;

    if (!pinnedTweetId) return null;

    return pinnedTweetId;
  },
  async allToLowercase() {
    const projects = await strapi.entityService?.findMany('api::project.project');
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
    for (const person of people) {
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
  async saveAllTwitterPfps() {
    const projects = await strapi.db
      ?.query('api::project.project')
      .findMany({ where: { twitter_img: { $notNull: true } } });
    const people = await strapi.db
      ?.query('api::person.person')
      .findMany({ where: { twitter_img: { $notNull: true } } });

    if (!projects || !people) {
      throw new Error('Couldnt find projects or people');
    }

    for (const project of projects) {
      if (project.twitter_img) {
        await fetch(project.twitter_img.replace('_normal', '_bigger')).then((res) =>
          (res.body as unknown as NodeJS.ReadableStream).pipe(
            fs.createWriteStream(
              join(process.cwd(), '../', `/images/projects/${project.slug}.png`),
            ),
          ),
        );
      }
    }
    for (const person of people) {
      if (person.twitter_img) {
        await fetch(person.twitter_img.replace('_normal', '_bigger')).then((res) =>
          (res.body as unknown as NodeJS.ReadableStream).pipe(
            fs.createWriteStream(join(process.cwd(), '../', `/images/people/${person.slug}.png`)),
          ),
        );
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
  async getAndSetAllProfiles() {
    const query = qs.stringify({
      'user.fields': 'profile_image_url',
    });
    const projects = await strapi.db
      ?.query('api::project.project')
      .findMany({ where: { twitter_url: { $notNull: true } } });
    const people = await strapi.db
      ?.query('api::person.person')
      .findMany({ where: { twitter: { $notNull: true } } });

    if (!projects || !people) {
      throw new Error('Couldnt find projects or people');
    }

    const chunkedProjects = sliceIntoChunks(projects, 100);
    const chunkedPeople = sliceIntoChunks(people, 100);
    console.log(`setting ${projects.length + people.length} images`);
    for (const chunk of chunkedProjects) {
      // console.log(`fetching twitter pfp for ${project.name}`);
      const names = chunk
        .map((item) => getHandleFromTwitterUrl(item.twitter_url).replaceAll('/', ''))
        .filter((d) => d)
        .join(',');

      const twitterInfos = await this.getUserTwitterInfo(names, query);

      if (twitterInfos?.length) {
        for (const info of twitterInfos) {
          if (info.profile_image_url) {
            const projects = (
              await strapi.service('api::project.project').find({
                filters: {
                  twitter_url: `https://twitter.com/${info.username.toLowerCase()}`,
                },
              })
            ).results;

            for (const project of projects) {
              const profileImageUrl = info.profile_image_url.replace('_normal', '_bigger');

              await strapi.entityService?.update('api::project.project', project.id, {
                data: {
                  ...project,
                  twitter_img: profileImageUrl,
                },
              });
            }
          }
        }
      }
    }
    for (const chunk of chunkedPeople) {
      // console.log(`fetching twitter pfp for ${project.name}`);
      const names = chunk
        .map((item) => getHandleFromTwitterUrl(item.twitter).replaceAll('/', ''))
        .filter((d) => d)
        .join(',');

      const query = qs.stringify({
        'user.fields': 'profile_image_url,description',
      });
      // await this.getProfileImageByUsername(names);
      const twitterInfos = await this.getUserTwitterInfo(names, query);

      if (twitterInfos?.length) {
        for (const info of twitterInfos) {
          if (info.profile_image_url) {
            const people = (
              await strapi.service('api::person.person').find({
                filters: {
                  twitter: `https://twitter.com/${info.username.toLowerCase()}`,
                },
              })
            ).results;

            for (const person of people) {
              const profileImageUrl = info.profile_image_url.replace('_normal', '_bigger');

              await strapi.entityService?.update('api::person.person', person.id, {
                data: {
                  ...person,
                  twitter_img: profileImageUrl,
                  bio: info.description,
                },
              });
            }
          }
        }
      }
    }
    return { success: true };
  },
}));
