module.exports = ({ env }) => ({
  proxy: true,
  url: env("NEXT_PUBLIC_STRAPI_API_URL"),
  app: {
    keys: env.array("APP_KEYS"),
  },
});
