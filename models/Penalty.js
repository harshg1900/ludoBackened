const { sequelize, DataTypes } = require("../config/db");

const Penalty = sequelize.define("penalty",{
    fraud:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:100,

    },
    noupdate:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:50,

    },
    wrongupdate:{
        type:DataTypes.INTEGER,
        allowNull:false,
        defaultValue:50,

    },
    commission:{
        type:DataTypes.FLOAT,
        allowNull:false,
        defaultValue:5,

    },
    
})

// Penalty.sync({alter:true})
module.exports = Penalty