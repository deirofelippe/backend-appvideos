require("dotenv").config();
const logger = require("../logger.js");

module.exports = {
   username: process.env.DB_USERNAME,
   password: process.env.DB_PASSWORD,
   database:
      process.env.NODE_ENV === "test"
         ? process.env.DB_DATABASE_TEST
         : process.env.DB_DATABASE,
   host: process.env.DB_HOST,
   dialect: process.env.DB_DIALECT,
   logging: (msg) => logger.info(msg),
};
