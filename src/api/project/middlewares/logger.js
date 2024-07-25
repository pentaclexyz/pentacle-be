module.exports = (config, { strapi }) => {
  return async (context, next) => {
    try {
      // TODO: Count the number of requests for each key
      console.log(context.headers?.authorization?.split(' ')[1]);
      console.log(context.headers?.host);
    } catch (e) {}
    // Call next to continue with the flow and get to the controller
    await next();
  };
};
