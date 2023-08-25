

const bcrypt = require("bcrypt");
const { UserDataType } = require("../constants");
const { sequelize , DataTypes, Op} = require("../config/db");

const User = sequelize.define(
  "user",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    phone: {
      type: DataTypes.BIGINT,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    role:{
        type:DataTypes.STRING,
        validate:{
            isIn:[Object.values(UserDataType)]
        }
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique:true,
    },
    password: {
      type: DataTypes.STRING(300),
    },

    referral:{
      type: DataTypes.STRING
    },
    referralCode:{
      type: DataTypes.STRING,
      unique:true,
    },
    blocked:{
      type:DataTypes.BOOLEAN,
      defaultValue:false
    }
  }
);
// User.sync({alter:true})
module.exports = {User}