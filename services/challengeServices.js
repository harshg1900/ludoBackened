const { ApiBadRequestError } = require("../errors");
const { Challenge } = require("../models")

class challengeServices{

    async createChallenge(challenger,category,price){
        console.log(challenger)
        console.log(category)
        console.log(price)
        const runningUserChallenges = await Challenge.scope("running").findAll({
            challenger:challenger,
            acceptor:challenger,
        });
        const existingUserChallenges = await Challenge.scope("created").findAll({
            challenger:challenger,
            acceptor:challenger,
        });
 
        if(runningUserChallenges?.length >1){
            throw new ApiBadRequestError("You already have 2 challenges ongoing, please complete them before creating new.")
        }
        if(existingUserChallenges?.length >1){
            throw new ApiBadRequestError("You already have 2 challenges created, please cancel them before creating new.")
        }

        const rslt = await Challenge.create({
            challenger,
            category,
            price,
            status:"created",

        })

        return rslt;
    }
}

module.exports = new challengeServices()