import { Strapi } from '@strapi/strapi';
import _ from 'lodash';
import { verifyMessage } from 'viem';
import { PROJECT_ATTESTATION_OVERRIDE } from './api/project/util/project-attestation-override';
import { getHandleFromTwitterUrl } from './util/util';

type SocialDataResponse = {
  id: number;
  id_str: string;
  name: string;
  screen_name: string;
  location: string;
  url: string;
  description: string;
  protected: false;
  verified: false;
  followers_count: number;
  friends_count: number;
  listed_count: number;
  favourites_count: number;
  statuses_count: number;
  created_at: string;
  profile_banner_url: string;
  profile_image_url_https: string;
  can_dm: null | boolean;
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Strapi }) {
    strapi
      .plugin('documentation')
      .service('override')
      // TODO: update list
      .registerOverride(PROJECT_ATTESTATION_OVERRIDE, {
        excludeFromGeneration: [
          'defi-safety-report',
          'section',
          'lore',
          'tweet',
          'term',
          'helper',
          'homepage',
          'connect',
          'auth',
          'governance-discussion',
          'governance-proposal',
          'global',
          'content-type',
          'audit',
          'about',
        ],
      });
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Strapi }) {
    strapi.db?.lifecycles.subscribe({
      async beforeCreate(event) {
        try {
          const ctx = strapi.requestContext.get();
          if (event.model.singularName === 'submission') {
            const { signature, eth_address, ...rest } = event.params.data;
            event.params.data = { ...rest, eth_address };
            event.params.data.slug = _.kebabCase(event.params.data.slug);
            const isValid = await verifyMessage({
              address: eth_address,
              message: 'Sign this message to submit a project',
              signature,
            });
            if (!isValid) {
              ctx.throw(400, 'Invalid signature');
              return;
            }
          }

          if (event.model.singularName === 'person') {
            event.params.data.twitter = event.params.data?.twitter?.toLowerCase();
          }
          if (event.model.singularName === 'project') {
            event.params.data.twitter_url = event.params.data?.twitter_url?.toLowerCase();
          }

          if (event.model.singularName === 'person' || event.model.singularName === 'project') {
            const username =
              event.model.singularName === 'person'
                ? event.params.data.twitter
                : event.params.data.twitter_url;
            const response = (await fetch(
              `https://api.socialdata.tools/twitter/user/${getHandleFromTwitterUrl(username)}`,
              {
                headers: {
                  Authorization: `Bearer ${process.env.SOCIALDATA_KEY}`,
                },
              },
            ).then((res) => {
              console.log(`API returned :${res.status}: ${res.statusText}`);
              return res.json();
            })) as SocialDataResponse;
            if (!event.params.data.twitter_img) {
              event.params.data.twitter_img = response.profile_image_url_https?.replace(
                '_normal',
                '_bigger',
              );
            }
            if (!event.params.data.twitter_banner) {
              event.params.data.twitter_banner = response.profile_banner_url?.replace(
                '_normal',
                '_bigger',
              );
            }
          }

          event.params.data.slug = _.kebabCase(event.params.data.slug);
        } catch (e) {
          console.log(e);
        }
      },
    });
  },
};
