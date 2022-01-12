require("dotenv").config();
const logger = require("../logger.js");

const testConfig = () => ({
   username: process.env.DB_USERNAME_TEST,
   password: process.env.DB_PASSWORD_TEST,
   database: process.env.DB_DATABASE_TEST,
   dialect: process.env.DB_DIALECT_TEST,
});

const productionConfig = () => ({
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database: process.env.DB_DATABASE,
   host: process.env.DB_HOST,
   dialect: process.env.DB_DIALECT,
});

const config =
   process.env.NODE_ENV === "test" ? testConfig() : productionConfig();

module.exports = {
   ...config,
   logging: (msg) => logger.info(msg),
};
