'use strict'
async function up(knex) {}
async function down(knex) {}
module.exports = {
  async up(knex) {
    // You have full access to the Knex.js API with an already initialized connection to the database
    // ------------------------
    // EXAMPLE: renaming a table
    // await knex.schema.renameTable('oldName', 'newName');
    // ------------------------
    // EXAMPLE: renaming a column
    // await knex.schema.table('someTable', table => {
    //   table.renameColumn('oldName', 'newName');
    // });
    // ------------------------
    // EXAMPLE: updating data
    // await knex.from('someTable').update({ columnName: 'newValue' }).where({ columnName: 'oldValue' });
    // ------------------------
  },
  async down(knex) {
    // This one isn't implemented yet, will be eventually
  },
};
