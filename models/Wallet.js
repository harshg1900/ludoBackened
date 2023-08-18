const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const Wallet = sequelize.define("wallet", {
  amount: {
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  earned:{
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  lost:{
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  withdrawn:{
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  bought:{
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  }
});

Wallet.belongsTo(User)
User.hasOne(Wallet)
// Wallet.sync()
module.exports = {Wallet}
