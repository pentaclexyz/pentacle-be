import type { CoreApi } from '@strapi/types';
import { Route } from '@strapi/types/dist/types/core-api/router';

export const customRouter = (innerRouter: CoreApi.Router.Router, extraRoutes: Route[] = []) => {
  let routes: Route[];
  return {
    get prefix() {
      return innerRouter.prefix;
    },
    get routes() {
      if (!routes) routes = (innerRouter.routes as Route[]).concat(extraRoutes);
      return routes;
    },
  };
};
