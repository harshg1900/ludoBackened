
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
  amount: {
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  },
  message: {
    type: DataTypes.TEXT,
  },
});

CoinTransaction.belongsTo(User, { as: 'Sender', foreignKey: 'sender' });
CoinTransaction.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver' });
MoneyTransaction.belongsTo(User, { as: 'Sender', foreignKey: 'sender' });
MoneyTransaction.belongsTo(User, { as: 'Receiver', foreignKey: 'receiver' });

// Transaction.sync();
// MoneyTransaction.sync({alter:true})
// CoinTransaction.sync({alter:true})
module.exports = { MoneyTransaction, CoinTransaction };
