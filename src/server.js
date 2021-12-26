const app = require("./app");
const db = require("./database");

const PORT = process.env.PORT || 3000;

(async () => {
   try {
      await db.sync();
      console.log("Database sync...");

      app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
   } catch (error) {
      console.error(error);
      await db.close();
   }
})();
