'use strict';

/**
 * project service.
 */

import { RequestContext, factories } from '@strapi/strapi';
import { fetchTwitterProfile } from '../../../util/util';
const { createCoreService } = factories;

if (!process.env.EAS_SCHEMA_UID || !process.env.EAS_GRAPHQL_URL) {
  throw new Error('EAS_SCHEMA_UID and EAS_GRAPHQL_URL env vars are required');
}

type QueryContext = RequestContext & {
  query: Record<string, any>;
};
module.exports = createCoreService('api::project.project', ({ strapi }) => ({
  // @TODO: move this into submission service
  async createSubmission({
    formData,
    submissionId,
    type = 'submission',
  }: {
    formData: Record<string, any>;
    submissionId: string;
    type: 'submission' | 'project-submission';
  }) {
    const { eth_address, twitter_handle, ...rest } = formData;
    let { profile_img, profile_banner } = formData;
    if (twitter_handle && (!profile_img || !profile_banner)) {
      const profile = (await fetchTwitterProfile(twitter_handle))!;
      if (!profile_img) {
        profile_img = profile.profile_image_url_https?.replace('_normal', '_bigger');
      }
      if (!profile_banner) {
        profile_banner = profile.profile_banner_url?.replace('_normal', '_bigger');
      }
    }
    const project = await strapi.entityService!.create('api::project.project', {
      data: {
        ...rest,
        twitter_img: profile_img,
        twitter_banner: profile_banner,
        twitter_url: `https://x.com/${twitter_handle}`,
        created_by: eth_address,
        publishedAt: new Date(),
      },
    });
    const submission = await strapi.entityService!.update(
      `api::${type}.${type}` as
        | 'api::project-submission.project-submission'
        | 'api::submission.submission',
      parseInt(submissionId),
      { data: { status: 'approved' } },
    );
    return { project, submission };
  },
  async getRelated(ctx: QueryContext) {
    const thisProject = await strapi.db!.query('api::project.project').findOne({
      where: { slug: ctx.query.slug },
      populate: {
        categories: true,
        sections: true,
      },
    });
    const categories = thisProject?.categories?.map((category: { slug: string }) => category.slug);
    const section = thisProject?.sections[0]?.slug || null;

    if (!categories || !section) {
      return {
        data: [],
      };
    }

    const filteredRelatedProjects = await strapi.db!.query('api::project.project').findMany({
      where: {
        slug: { $ne: ctx.query.slug },
        sections: {
          slug: section,
          categories: { slug: { $in: categories } },
        },
      },
      limit: 200,
      populate: {
        categories: true,
        sections: true,
      },
    });

    const filteredMappedRelatedProjects = filteredRelatedProjects.map((project) => {
      const { id, ...rest } = project;
      return {
        id: id,
        attributes: {
          ...rest,
          sections: {
            data: project.sections.map((section: { id: number; [key: string]: any }) => {
              const { id, ...rest } = section;
              return {
                id: id,
                attributes: {
                  ...rest,
                },
              };
            }),
          },
          categories: {
            data: project.categories.map((category: { id: number; [key: string]: any }) => {
              const { id, ...rest } = category;
              return {
                id: id,
                attributes: {
                  ...rest,
                },
              };
            }),
          },
        },
      };
    });
    return {
      data: filteredMappedRelatedProjects,
    };
  },
  async getSlim(ctx: QueryContext) {
    const populatedKeys = Object.keys(ctx.query?.populate || {});
    const opts = ctx.query?.filters?.slug ? { where: { slug: ctx.query.filters.slug } } : {};
    const data = await strapi.db!.query('api::project.project').findOne({
      ...opts,
      populate: populatedKeys,
    });
    if (!data) {
      return {
        data: [],
        meta: {
          pagination: {
            total: 0,
            page: 1,
            pageSize: 1,
          },
        },
      };
    }
    for (const key of populatedKeys) {
      if (data[key]) {
        if (key === 'treasury_wallets') {
          continue;
        }
        if (key === 'risk_urls') {
          data[key] = data[key].map((item: { id: number; [key: string]: any }) => {
            const { id, ...rest } = item;
            return {
              id: id,
              attributes: {
                ...rest,
              },
            };
          });
          continue;
        }
        data[key] = {
          data: data[key].map((item: { id: number; [key: string]: any }) => {
            const { id, ...rest } = item;
            return {
              id: id,
              attributes: {
                ...rest,
              },
            };
          }),
        };
      }
    }
    const { id, ...rest } = data;
    return {
      data: [
        {
          id: id,
          attributes: {
            ...rest,
          },
        },
      ],
      meta: {
        pagination: {
          total: 1,
          page: 1,
          pageSize: 1,
        },
      },
    };
  },
  async getAttestations(ctx: QueryContext) {
    const { refUID, attester } = ctx.query;
    const body = {
      operationName: 'Attestations',
      variables: {
        where: {
          refUID: {
            equals: refUID,
          },
          schemaId: {
            equals: process.env.EAS_SCHEMA_UID,
          },
        },
      },
      query:
        'query Attestations($where: AttestationWhereInput) {\n  attestations(take: 100, orderBy: {time: desc}, where: $where) {\n    attester\n    decodedDataJson\n    expirationTime\n    id\n    ipfsHash\n    isOffchain\n    recipient\n    refUID\n    revoked\n    schemaId\n    time\n    timeCreated\n    txid\n    __typename\n  }\n}',
    } as {
      operationName: string;
      variables: {
        where: {
          refUID: {
            equals: string;
          };
          schemaId: {
            equals: string;
          };
          attester?: {
            equals: string;
          };
        };
      };
      query: string;
    };
    if (attester) {
      body.variables.where.attester = { equals: attester };
    }
    return await fetch(process.env.EAS_GRAPHQL_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res: any) => {
        res.data.attestations = res.data.attestations.map(
          (attestation: { decodedData: any; decodedDataJson: string }) => {
            attestation.decodedData = JSON.parse(attestation.decodedDataJson);
            return attestation;
          },
        );
        return res;
      });
  },
}));
