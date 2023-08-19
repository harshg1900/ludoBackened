const { sequelize, DataTypes } = require("../config/db");
const { User } = require("./User");

const Referral = sequelize.define("referral",{
    userA:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    },
    userB:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"id"
        }
    }
})
// Referral.sync()

module.exports = {Referral}