'use strict';
module.exports = {
  async index(ctx, next) {
    const entries = await strapi.db.query('api::project.project').findMany({
      where: {
        category: {
            name: {
              $contains: 'cex'
          },
        }
      },
    });
    ctx.body = entries;
  }
};
