import { Config } from "knex";

module.exports = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./chat.db",
  },
} as Config;
