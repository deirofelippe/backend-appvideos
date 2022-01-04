const app = require("./app");
const db = require("./database");
const logger = require("./logger");

const PORT = process.env.API_PORT || 3000;

(async () => {
   try {
      await db.sync();
      logger.info("Database sync...");

      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
   } catch (error) {
      logger.error(error);
      await db.close();
   }
})();
