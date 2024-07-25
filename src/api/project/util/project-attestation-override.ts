export const PROJECT_ATTESTATION_OVERRIDE = {
  // Only run this override for version 1.0.0
  info: { version: '1.0.1' },
  paths: {
    '/project-attestations': {
      get: {
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/ProjectResponse',
                },
              },
            },
          },
          '400': {
            description: 'Bad Request',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '401': {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '403': {
            description: 'Forbidden',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '404': {
            description: 'Not Found',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
          '500': {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error',
                },
              },
            },
          },
        },
        tags: ['Project'],
        parameters: [
          {
            name: 'refUID',
            in: 'query',
            description: 'attestation_uid from project',
            required: true,
            type: 'string',
          },
          {
            name: 'attester',
            in: 'query',
            description: '(optional) Ethereum address of attester to filter',
            required: false,
            type: 'integer',
          },
        ],
        operationId: 'get/project-attestations',
      },
    },
  },
};
