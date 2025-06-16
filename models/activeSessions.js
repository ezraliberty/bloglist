const { Model, DataTypes } = require("sequelize");

const { sequelize } = require("../util/db");

class ActiveSession extends Model {}
ActiveSession.init(
  {
    token: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "users", key: "id" },
    }
  },
  {
    sequelize,
    underscored: true,
    timestamps: true,
    modelName: "active_session",
  }
);

module.exports = ActiveSession