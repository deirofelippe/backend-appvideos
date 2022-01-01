const migration = {
   up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable("Usuarios", {
         id: {
            type: Sequelize.DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
         },
         nome: {
            type: Sequelize.DataTypes.STRING(70),
            allowNull: false,
         },
         email: {
            type: Sequelize.DataTypes.STRING(70),
            allowNull: false,
            unique: true,
         },
         senha: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false,
         },
         cpf: {
            type: Sequelize.DataTypes.STRING(14),
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
      await queryInterface.dropTable("Usuarios");
   },
};

module.exports = migration;
