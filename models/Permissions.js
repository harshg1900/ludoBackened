const { sequelize, DataTypes } = require("../config/db");
const { Admin } = require("./Admin");

const Permission = sequelize.define("permission",{
    block_user:{
        type:DataTypes.BOOLEAN,
        defaultValue:false

    },
    add_coins:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    withdraw_coins:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    challenge_result:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    settings:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    manage_admin:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
})

Permission.belongsTo(Admin)
// Permission.sync({alter:true})
module.exports = {Permission}