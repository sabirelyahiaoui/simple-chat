const { src, dest, parallel, watch } = require("gulp");
const webpack = require("webpack-stream");
const webpackConfig = require("./webpack.config");
const ts = require("gulp-typescript");
const Knex = require("knex");
const knexConfig = require("./knexfile");

const tsProject = ts.createProject("./tsconfig.json", {
  rootDir: "./src/server",
  outDir: "./dist/server",
  esModuleInterop: true,
  types: ["./src/"],
});

const client = () =>
  src(webpackConfig.entry)
    .pipe(webpack(webpackConfig))
    .pipe(dest(webpackConfig.output.path));

const server = () =>
  src("./src/server/**/*.ts")
    .pipe(tsProject())
    .js.pipe(dest("./dist/server"));

const watchServer = () => {
  watch(["./src/server/**/*.ts"], server);
};

const database = async () => {
  const knex = Knex(knexConfig);

  const exists = await knex.schema.hasTable("messages");
  if (!exists) {
    knex.migrate.latest().then(() => {
      knex.destroy();
    });
  } else {
    knex.destroy();
  }
};

module.exports = {
  server,
  watchServer,
  database,
  client,
  default: parallel(client, server, database),
};
