const { DataTypes, Model } = require("sequelize");

class Usuario extends Model {
   static init(sequelize) {
      super.init(
         {
            id: {
               type: DataTypes.UUID,
               allowNull: false,
               primaryKey: true,
            },
            nome: {
               type: DataTypes.STRING(60),
               allowNull: false,
            },
            email: {
               type: DataTypes.STRING(100),
               allowNull: false,
               unique: true,
            },
            senha: {
               type: DataTypes.STRING,
               allowNull: false,
            },
            cpf: {
               type: DataTypes.STRING(14),
               allowNull: false,
               unique: true,
            },
         },
         { sequelize }
      );
   }
}

module.exports = Usuario;
