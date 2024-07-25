module.exports = (config, { strapi }) => {
  return async (context, next) => {
    const startTime = Date.now();

    try {
      // Call next to continue with the flow and get to the controller
      await next();
    } finally {
      const endTime = Date.now();
      const duration = `${endTime - startTime}`;

      const logEntry = async () => {
        const key = context.headers?.authorization?.split(' ')[1];
        const host = context.headers?.host;
        const method = context.request.method;
        const path = context.request.url;
        const statusCode = context.response.status;

        await strapi.entityService.create('api::api-usage.api-usage', {
          data: {
            key: key ? `${key.slice(0, 5)}...${key.slice(-5)}` : 'anonymous',
            host,
            method,
            path,
            statusCode: `${statusCode}`,
            duration,
            timestamp: new Date().toISOString(),
          },
        });
      };

      // Log the entry without blocking the response
      logEntry().catch((error) => {
        debugger;
        console.error('Failed to log API usage:', error);
      });
    }
  };
};
