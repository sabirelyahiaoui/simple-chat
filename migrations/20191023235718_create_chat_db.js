const Knex = require("knex");

module.exports = {
  up: knex =>
    knex.schema.createTable("messages", table => {
      table.string("id").primary();
      table.string("text", 1000).notNullable();
      table.string("userId", 20).notNullable();
      table.string("username", 30).notNullable();
      table
        .boolean("edited")
        .defaultTo(false)
        .notNullable();
      table
        .dateTime("dateCreated")
        .defaultTo(new Date())
        .notNullable();
    }),
  down: knex => knex.schema.dropTableIfExists("messages"),
};
