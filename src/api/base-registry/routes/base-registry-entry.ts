/**
 * base_registry_entry router.
 */

import { factories } from '@strapi/strapi';

const { createCoreRouter } = factories;

const defaultRouter = createCoreRouter('api::base-registry.base-registry-entry');

export default defaultRouter;
