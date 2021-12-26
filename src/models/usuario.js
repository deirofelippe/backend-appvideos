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
               type: DataTypes.STRING,
               allowNull: false,
            },
            email: {
               type: DataTypes.STRING,
               allowNull: false,
               unique: true,
            },
         },
         { sequelize }
      );
   }
}

module.exports = Usuario;
