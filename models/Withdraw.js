
const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const WithdrawRequest = sequelize.define("withdrawRequest", {
  amount: {
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  details:{
    type:DataTypes.TEXT,
    allowNull:false,
  },
  status:{
    type:DataTypes.ENUM,
    values:["pending","accepted","rejected"],
    defaultValue:"pending"
  },
  message:{
    type:DataTypes.STRING,

  },
  image:{
    type:DataTypes.STRING
  }
});
WithdrawRequest.belongsTo(User)
User.hasMany(WithdrawRequest)
// WithdrawRequest.sync({alter:true})
module.exports = {WithdrawRequest}


