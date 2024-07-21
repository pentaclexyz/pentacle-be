export default {
  routes: [
    {
      method: 'GET',
      path: '/base-registry/fetch-all-entries-from-registry',
      handler: 'api::base-registry.base-registry-entry.fetchAllEntriesFromRegistry',
    },
    {
      method: 'GET',
      path: '/base-registry/remove-all-project-relations',
      handler: 'api::base-registry.base-registry-entry.removeAllProjectRelations',
    },
  ],
};
