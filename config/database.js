module.exports = ({ env }) => ({
  settings: {
    forceMigration: false,
  },
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST", "127.0.0.1"),
      port: env.int("DATABASE_PORT", 5432),
      database: env("DATABASE_NAME", "pentacle-cms-staging"),
      // user: env('DATABASE_USERNAME', 'pentacle'),
      // password: env('DATABASE_PASSWORD', 'w1ld'),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
