const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const Transaction = sequelize.define("transaction",{
    sender:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:id
        }
    }
})