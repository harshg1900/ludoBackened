const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const MoneyTransaction = sequelize.define("moneyTransaction", {
  sender: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  receiver: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  amount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  message: {
    type: DataTypes.TEXT,
  },
});

const CoinTransaction = sequelize.define("coinTransaction", {
  sender: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  receiver: {
    type: DataTypes.INTEGER,
    references: {
      model: User,
      key: "id",
    },
  },
  amount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  message: {
    type: DataTypes.TEXT,
  },
});
// Transaction.sync();
// MoneyTransaction.sync()
// CoinTransaction.sync()
module.exports = { MoneyTransaction, CoinTransaction };
