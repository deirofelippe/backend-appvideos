const migration = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("usuarios", {
         id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
         },
         nome: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
         },
         email: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
            unique: true,
         },
         createdAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
         },
         updatedAt: {
            type: Sequelize.DataTypes.DATE,
            allowNull: false,
         },
      });
   },
   down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable("usuarios");
   },
};

module.exports = migration;
