

const bcrypt = require("bcrypt");
const { UserDataType } = require("../constants");
const { sequelize , DataTypes, Op} = require("../config/db");

const Admin = sequelize.define(
  "admin",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.BIGINT,
      // unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      // unique: true,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique:true,
    },
    password: {
      type: DataTypes.STRING(300),
    },
    status:{
      type:DataTypes.ENUM,
      values:["active","inactive"]
    }
  }
);
// Admin.sync({force:true})
module.exports = {Admin}