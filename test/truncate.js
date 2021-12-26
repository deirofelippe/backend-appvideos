const map = require("lodash/map");

async function truncate(models) {
   const collection = Object.keys(models);

   return await Promise.all(
      map(collection, (key) => {
         if (["sequelize", "Sequelize"].includes(key)) return null;

         return models[key].destroy({ where: {}, force: true });
      })
   );
}

module.exports = truncate;
