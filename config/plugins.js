module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET'),
    },
  },
  'open-ai': {
    enabled: true,
    config: {
      API_TOKEN: env('OPENAI_TOKEN'),
    },
  },
  documentation: {
    enabled: true,
    config: {
      openapi: '3.0.0',
      info: {
        version: '1.0.1',
        title: 'DOCUMENTATION',
        description: '',
        termsOfService: 'YOUR_TERMS_OF_SERVICE_URL',
        contact: {
          name: 'PENTACLE',
          email: 'pentacle@pentacle.xyz',
          url: 'https://pentacle.xyz',
        },
        license: {
          name: 'Apache 2.0',
          url: 'https://www.apache.org/licenses/LICENSE-2.0.html',
        },
      },
      'x-strapi-config': {
        // Leave empty to ignore plugins during generation
        plugins: [],
        path: '/documentation',
      },
      servers: [
        {
          url: env('DOCUMENTATION_SERVER'),
          description: 'Documentation server',
        },
      ],
      externalDocs: {
        description: 'Find out more',
        url: 'https://docs.strapi.io/developer-docs/latest/getting-started/introduction.html',
      },
      security: [{ bearerAuth: [] }],
    },
  },
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        delete: {},
      },
    },
  },
  config: {
    provider: {
      name: 'memory',
      options: {
        max: 32767,
        maxAge: 3600,
      },
    },
    strategy: {
      contentTypes: [
        // list of Content-Types UID to cache
        'api::category.category',
        'api::article.article',
        'api::global.global',
        'api::homepage.homepage',
        'api::project.project',
        'api::tag.tag',
        'api::section.section',
        'api::skill.skill',
        'api::skill-level.skill-level',
        'api::skill-type.skill-type',
        'api::person.person',
        'api::governance-discussion.governance-discussion',
        'api::governance-proposal.governance-proposal',
        'api::base-registry.base-registry-entry',
      ],
    },
  },
});
