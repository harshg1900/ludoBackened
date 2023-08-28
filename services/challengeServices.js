const { sequelize, Op } = require("../config/db");
const { challengeCategories, challengeStatus } = require("../constants");
const { ApiBadRequestError, Api404Error, ApiForbiddenError, ApiUnathorizedError } = require("../errors");
const logger = require("../logger");
const { Challenge, Result, User } = require("../models");
const { generateRandomNumber } = require("../utils");
const walletServices = require("./walletServices");

class challengeServices {
  async createChallenge(challenger, category, price) {
    console.log(challenger);
    console.log(category);
    console.log(price);
    const runningUserChallenges = await Challenge.scope("running").findAll({
      where: {
        [Op.or]: [
          {
            challenger: challenger,
          },
          {
            acceptor: challenger,
          },
        ],
      },
    });
    const existingUserChallenges = await Challenge.scope("created").findAll({
      where: {
        [Op.or]: [
          {
            challenger: challenger,
          },
          {
            acceptor: challenger,
          },
        ],
      },
    });

    if (runningUserChallenges?.length > 2) {
      throw new ApiBadRequestError(
        "You already have 2 challenges ongoing, please complete them before creating new."
      );
    }
    if (existingUserChallenges?.length > 2) {
      throw new ApiBadRequestError(
        "You already have 1 challenges created, please cancel them before creating new."
      );
    }
    const balance = await walletServices.withdrawCoins(price, challenger);
    const roomcode = generateRandomNumber(10000, 99999);
    const rslt = await Challenge.create({
      challenger,
      category,
      price,
      status: "created",
      roomcode,
    });
   
    console.log("rslt",rslt);
    console.log("challengeId",rslt.dataValues.id);
    const result = await Result.create({
      challengeId:rslt.dataValues.id
    })
    rslt.dataValues.balance = balance;
    return rslt;
  }
  async getChallenges(
    status,
    category,
    price,
    challenger,
    acceptor,
    limit,
    offset
  ) {
    const whereCondition = {};

    if (status !== undefined) {
      whereCondition.status = status;
    }

    if (category !== undefined) {
      whereCondition.category = category;
    }

    if (price !== undefined) {
      whereCondition.price = price;
    }

    if (challenger !== undefined) {
      whereCondition.challenger = challenger;
    }

    if (acceptor !== undefined) {
      whereCondition.acceptor = acceptor;
    }

    const rslt = await Challenge.findAndCountAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      where: whereCondition,
      include: [
        {
          model: Result,
          attributes: ["winner"],
          include: [
            {
              model: User,
              as: "WinnerUser",
              attributes: ["username", "id", "name"],
            },
          ],
        },
        {
          model: User,
          as: "ChallengerUser",
          attributes: ["username", "id", "name"],
        },
        {
          model: User,
          as: "AcceptorUser",
          attributes: ["username", "id", "name"],
        },
      ],
    });
    return rslt;
  }
  async acceptChallenge(acceptor, challengeId) {
    // const t1 = await sequelize.transaction();
    const result = await sequelize.transaction(async (t1) => {
      const rslt = await Challenge.findByPk(challengeId, {
        skipLocked: true,
        lock: true,
        transaction: t1,
      });
      console.log("accept challenge rslt", rslt);
      if (!rslt) {
        throw new ApiBadRequestError(
          "No challenge found with challengeId " + challengeId
        );
      }
      if (rslt.acceptor) {
        throw new ApiBadRequestError(
          "The requested challenge is already running"
        );
      }
      if (rslt.challenger == acceptor) {
        throw new ApiBadRequestError(
          "This challenge was created by you. You cannot accept your own challenge"
        );
      }
      if (rslt.status == challengeStatus.CANCELLED) {
        throw new ApiBadRequestError("Cancelled challenge");
      }
      if ((rslt.status == challengeStatus.CREATED)) {
        const balance = await walletServices.withdrawCoins(
          rslt.price,
          acceptor
        );
        rslt.acceptor = acceptor;
        rslt.status = challengeStatus.RUNNING;
        await rslt.save({ transaction: t1 });
        rslt.dataValues.balance = balance;
        return rslt;
      }
    });
    return result;
  }

  async deleteChallenge(uid,challengeId){
    const challenge = await Challenge.findOne({
      where:{
        id:challengeId
      }
    })
    if(!challenge){
      throw new Api404Error("Challenge does not exist")
    }
    

    if(challenge.challenger != uid){
      throw new ApiUnathorizedError("You are not allowed to Cancel this challenge as this is not created by you.")
    }
    if(challenge.status == "running"){
      throw new ApiBadRequestError("The challenge is already is running. Cannot cancel now.")
    }
    if(challenge.status == "completed"){
      throw new ApiBadRequestError("This challenge has completed. Cannot cancel now.")
    }
    if(challenge.status == "judgement"){
      throw new ApiBadRequestError("This challenge is with admin for judgement. Cannot cancel now")
    }
    await walletServices.addCoins(challenge.price,uid);
    challenge.status = "cancelled"
    await challenge.save()
    return
  }
}

module.exports = new challengeServices();
