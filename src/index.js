"use strict";

module.exports = {
    /**
     * An asynchronous register function that runs before
     * your application is initialized.
     *
     * This gives you an opportunity to extend code.
     */
    register({strapi}) {
        strapi.plugin("documentation").service("override")
            // TODO: update list
            .excludeFromGeneration(["defi-safety-report", "section", "lore", "tweet", "term", "helper", "homepage", "connect", "auth", "governance-discussion", "governance-proposal", "global", "content-type", "audit", "about", "users", "users-permissions", "upload"]);
    },

    /**
     * An asynchronous bootstrap function that runs before
     * your application gets started.
     *
     * This gives you an opportunity to set up your data model,
     * run jobs, or perform some special logic.
     */
    async bootstrap({strapi}) {
        strapi.db.lifecycles.subscribe({
            async beforeCreate(event) {
                if (event.model.singularName === "person") {
                    event.params.data.twitter = event.params.data?.twitter?.toLowerCase();
                }
                if (event.model.singularName === "project") {
                    event.params.data.twitter_url =
                        event.params.data?.twitter_url?.toLowerCase();
                }

                event.params.data.slug = event.params.data.slug?.toLowerCase();
            },
        });
    },
};
