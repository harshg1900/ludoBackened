
const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const Request = sequelize.define("request", {
  amount: {
    type:DataTypes.DOUBLE,
    defaultValue:0.0,
    allowNull:false
  },
  image:{
    type:DataTypes.TEXT,
    allowNull:false,
  },
  status:{
    type:DataTypes.ENUM,
    values:["pending","accepted","rejected"],
    defaultValue:"pending"
  }
});
Request.belongsTo(User)
User.hasMany(Request)
// Request.sync({alter:true})
module.exports = {Request}


