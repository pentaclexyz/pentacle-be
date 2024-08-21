export default ({ env }) => ({
  settings: {
    forceMigration: true,
  },
  connection: {
    client: 'postgres',
    connection: {
      host: env('DATABASE_HOST', '127.0.0.1'),
      port: env.int('DATABASE_PORT', 5432),
      database: env('DATABASE_NAME', 'pentacle-prod-aug-01-2024'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
