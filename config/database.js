module.exports = ({ env }) => ({
  settings: {
    forceMigration: false,
  },
  connection: {
    client: "postgres",
    connection: {
      host: env('HOST', '127.0.0.1'),
      port: env.int('PORT', 5432),
      database: env('DATABASE', 'pentacle-20'),
      ssl: env.bool(true),
    },
  },
});
