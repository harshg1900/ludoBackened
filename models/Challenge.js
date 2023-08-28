const { sequelize , DataTypes, Op} = require("../config/db");
const { challengeCategories, challengeStatus } = require("../constants");
const { User } = require("./User");
const Challenge = sequelize.define("challenge",{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    challenger:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key: "id"
        }
    },
    acceptor:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key: "id"
        }
    },
    category:{
        type:DataTypes.STRING,
        validate:{
            isIn: [Object.values(challengeCategories)]
        }
    },
    price:{
        type:DataTypes.INTEGER,
        defaultValue:0,
        allowNull:false,

    },
    status:{
        type: DataTypes.ENUM,
        values: [Object.values(challengeStatus)]
    },
    roomcode:{
        type:DataTypes.INTEGER,
        allowNull:false
    }

});

Challenge.belongsTo(User, { as: 'ChallengerUser', foreignKey: 'challenger' });
Challenge.belongsTo(User, { as: 'AcceptorUser', foreignKey: 'acceptor' });


Challenge.addScope("running",{
    where:{
        status:"running"
    }
})
Challenge.addScope("created",{
    where:{
        status:"created"
    }
})

const Result = sequelize.define("result",{
    id:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true,
    
    },
    challenger_input:{
        type:DataTypes.BOOLEAN,
        defaultValue:true 
    },
    challenger_image:{
        type:DataTypes.STRING,

    },
    acceptor_input:{
        type:DataTypes.BOOLEAN,
        defaultValue:true,
    },
    acceptor_image:{
        type:DataTypes.STRING,

    },
    admin:{
        type:DataTypes.INTEGER
    },
    challenger_responded:{
        type:DataTypes.BOOLEAN,
        defaultValue:false

    },
    acceptor_responded:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }


    
   

})
Challenge.hasOne(Result)
Result.belongsTo(Challenge)
Result.belongsTo(User, { as: 'WinnerUser', foreignKey: 'Winner' });

//  Challenge.sync({force:true}).then(()=>{

    //  Result.sync({force:true});
//  });
module.exports = {Challenge,Result}