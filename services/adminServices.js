const {
  Api404Error,
  ApiUnathorizedError,
  ApiBadRequestError,
} = require("../errors");
const {
  Admin,
  Request,
  WithdrawRequest,
  User,
  Challenge,
  Result,
  Wallet,
  MoneyTransaction,
  CoinTransaction,
} = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userAuthServices = require("./userAuthServices");
const walletServices = require("../services/walletServices");
const { sequelize, Op } = require("../config/db");
const { commission, penalties } = require("../constants");
class adminServices {
  async login(email, password) {
    const admin = await Admin.findOne({
      where: {
        email: email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    if (!admin) {
      throw new Api404Error("No account found with this email");
    }
    const salt = await bcrypt.genSaltSync(10);
    // logger.debug("user",user)
    // logger.debug(password,user.password)
    const verified = await bcrypt.compare(password, admin.password);

    // const verified = password == admin.password;
    if (verified) {
      const adminWithoutPassword = { ...admin.toJSON() };
      delete adminWithoutPassword.password;
      return {
        token: await userAuthServices.getAccessToken({
          uid: admin.id,
          role: "admin",
        }),
        user: adminWithoutPassword,
      };
    } else {
      throw new ApiUnathorizedError(
        "Given email/password combination is invalid"
      );
    }
  }

  async createAdmin(phone, email, name, username, password) {
    let admin = await Admin.findOne({
      where: {
        status: "active",
        [Op.or]: [
          {
            phone,
          },
          {
            email,
          },
          {
            name,
          },
          {
            username,
          },
        ],
      },
    });
    if (admin) {
      let errorFields = [];

      if (admin.phone === phone) errorFields.push("phone");
      if (admin.email === email) errorFields.push("email");
      if (admin.name === name) errorFields.push("name");
      if (admin.username === username) errorFields.push("username");

      let errorMessage = `A admin already exists with the following field(s): ${errorFields.join(
        ", "
      )}`;
      throw new ApiBadRequestError(errorMessage);
    }
    const salt = await bcrypt.genSaltSync(10);
    password = bcrypt.hashSync(password, salt);
    admin = await Admin.create({
      phone,
      email,
      name,
      username,
      password,
      status: "active",
    });
    return admin;
  }
  async getCoinRequests() {
    const requests = await Request.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "name", "id", "email", "phone"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    return requests;
  }
  async getWithdrawRequest() {
    const requests = await WithdrawRequest.findAll({
      include: [
        {
          model: User,
          attributes: ["username", "name", "id", "email", "phone"],
          include: [
            {
              model: Wallet,
            },
          ],
        },
      ],
    });
    return requests;
  }
  async getChallengeResults() {
    const requests = await Challenge.findAll({
      where: {
        status: "judgement",
      },
      include: [
        {
          model: Result,

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
    return requests;
  }

  async updateCoinRequest(id, message, status, adminId, amount) {
    const request = await Request.findOne({
      where: {
        id,
      },
    });
    if (request.status != "pending") {
      throw new ApiBadRequestError(`This request is already ${request.status}`);
    }
    request.message = message;
    request.status = status;
    request.admin = adminId;
    if (status == "accepted") {
      request.amount = amount;
    }
    await request.save();
    if (status == "accepted") {
      await walletServices.addCoins(request.amount, request.userId);
      await walletServices.addCoins(request.amount, request.userId, "bought");

      await MoneyTransaction.create({
        sender:request.userId,
        receiver:1,
        message:"add coin request"
      })
      await CoinTransaction.create({
        sender:1,
        receiver:request.userId,
        message:"added coins"
      })

    }
    return request;
  }
  async updateWithdrawRequest(id, message, status, adminId, amount) {
    const request = await WithdrawRequest.findOne({
      where: {
        id,
      },
    });
    if (request.status != "pending") {
      throw new ApiBadRequestError(`This request is already ${request.status}`);
    }

    const wallet = await Wallet.findOne({
      where:{
        userId:request.userId
      }
    })
    if(wallet.amount < amount){
      request.status = "rejected"
      request.message = 'Insufficient Balance at the time of request approval. Please request again and ensure sufficient balance of coins.'
      await request.save()
      throw new ApiBadRequestError("This request will be changed to rejected because the current wallet amount is less then requested withdraw amount. The message will be 'Insufficient Balance at the time of request approval. Please request again and ensure sufficient balance of coins.'")
    }
    request.message = message;
    request.status = status;
    request.admin = adminId;
    if (status == "accepted") {
      request.amount = amount;
    }
    await request.save();
    if (status == "accepted") {
      await walletServices.withdrawCoins(request.amount, request.userId);
      await walletServices.withdrawCoins(
        request.amount,
        request.userId,
        "withdrawn"
      );

      await MoneyTransaction.create({
        sender:1,
        receiver:request.userId,
        message:"add coins"
      })

      await CoinTransaction.create({
        sender:request.userId,
        receiver:1,
        message:"withdrew coins"
      })

    }
    return request;
  }
  async updateChallengeResult(challengeId, winnerId, admin, type) {
    const challenge = await Challenge.findOne({
      where: {
        id: challengeId,
      },
      include: [
        {
          model: Result,
        },
      ],
    });
    if (challenge.status != "judgement") {
      throw new ApiBadRequestError(
        `This challenge is already ${challenge.status}`
      );
    }
    challenge.status = "completed";
    await challenge.save();
    const result = await Result.findOne({
      where: {
        challengeId: challengeId,
      },
    });
    result.Winner = winnerId;
    result.admin = admin;
    await result.save();
    const award =
      2 * parseInt(challenge.price) - commission * parseInt(challenge.price);
    await walletServices.addCoins(award, winnerId);
    await walletServices.addCoins(award, winnerId, "earned");

    //add coins to admin
    await walletServices.addCoins(commission * parseInt(challenge.price), 1);
    await CoinTransaction.create({
      sender:winnerId,
      receiver:1,
      message:"commission"
    })
    if (challenge.challenger == winnerId) {
      await CoinTransaction.create({
        sender:challenge.acceptor,
        receiver:winnerId,
        message:"challenge result"
      })
      await CoinTransaction.create({
        sender:challenge.acceptor,
        receiver:1,
        message:"penalty"
      })
      await walletServices.withdrawCoins(
        type === 1
          ? penalties.FRAUD
          : type === 2
          ? penalties.NOUPDATE
          : penalties.WRONGUPDATE,
        challenge.acceptor
      );
      await walletServices.withdrawCoins(
        type === 1
          ? penalties.FRAUD
          : type === 2
          ? penalties.NOUPDATE
          : penalties.WRONGUPDATE,
        challenge.acceptor,
        "penalty"
      );
    } else if (challenge.acceptor == winnerId) {
      await CoinTransaction.create({
        sender:challenge.challenger,
        receiver:winnerId,
        message:"challenge result"
      })
      await CoinTransaction.create({
        sender:challenge.challenger,
        receiver:1,
        message:"penalty"
      })
      await walletServices.withdrawCoins(
        type === 1
          ? penalties.FRAUD
          : type === 2
          ? penalties.NOUPDATE
          : penalties.WRONGUPDATE,
        challenge.challenger
      );
      await walletServices.withdrawCoins(
        type === 1
          ? penalties.FRAUD
          : type === 2
          ? penalties.NOUPDATE
          : penalties.WRONGUPDATE,
        challenge.challenger,
        "penalty"
      );
    }

    return await Challenge.findOne({
      where: {
        id: challengeId,
      },
      include: [
        {
          model: Result,

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
  }
  async getDashboardData(startDate, endDate) {
    console.log(startDate);
    let data = {};

    data.rangeDeposits = await Request.sum("amount", {
      where: {
        status: "accepted",
        createdAt: {
          [Op.and]: [
            {
              [Op.gte]: startDate,
            },
            {
              [Op.lte]: endDate,
            },
          ],
        },
      },
    });
    data.totalDeposits = await Request.sum("amount", {
      where: {
        status: "accepted",
      },
    });

    let today = new Date();
    let formattedDate = `${String(today.getDate()).padStart(2, "0")}-${String(
      today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;
    console.log(formattedDate);
    let dateString = formattedDate;
    let parts = dateString.split("-");
    let utcDateString = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`;
    let todayStartDate = new Date(utcDateString);

    dateString = formattedDate;
    parts = dateString.split("-");
    utcDateString = `${parts[2]}-${parts[1]}-${parts[0]}T23:59:59Z`;
    let todayEndDate = new Date(utcDateString);

    data.todayDeposits = await Request.sum("amount", {
      where: {
        status: "accepted",
        createdAt: {
          [Op.and]: [
            {
              [Op.gte]: todayStartDate,
            },
            {
              [Op.lte]: todayEndDate,
            },
          ],
        },
      },
    });

    data.rangeWithdraw =
      (await WithdrawRequest.sum("amount", {
        where: {
          status: "accepted",
          createdAt: {
            [Op.and]: [
              {
                [Op.gte]: startDate,
              },
              {
                [Op.lte]: endDate,
              },
            ],
          },
        },
      })) || 0;

    data.totalWithdraw = await WithdrawRequest.sum("amount", {
      where: {
        status: "accepted",
      },
    });

    data.todayWithdraw =
      (await WithdrawRequest.sum("amount", {
        where: {
          status: "accepted",
          createdAt: {
            [Op.and]: [
              {
                [Op.gte]: todayStartDate,
              },
              {
                [Op.lte]: todayEndDate,
              },
            ],
          },
        },
      })) || 0;

    data.totalUsers = (await User.findAndCountAll({})).count || 0;
    data.blockedUsers =
      (
        await User.findAndCountAll({
          where: {
            blocked: true,
          },
        })
      ).count || 0;

    data.completedChallenges =
      (
        await Challenge.findAndCountAll({
          where: {
            status: "completed",
          },
        })
      ).count || 0;
    data.ongoingChallenges =
      (
        await Challenge.findAndCountAll({
          where: {
            status: "running",
          },
        })
      ).count || 0;
    data.createdChallenges =
      (
        await Challenge.findAndCountAll({
          where: {
            status: "created",
          },
        })
      ).count || 0;
    data.cancelledChallenges =
      (
        await Challenge.findAndCountAll({
          where: {
            status: "cancelled",
          },
        })
      ).count || 0;
    data.judgementChallenges =
      (
        await Challenge.findAndCountAll({
          where: {
            status: "judgement",
          },
        })
      ).count || 0;

      data.commission = ((await Wallet.findOne({
        where:{
          id:1
        }
      })).amount) || 0
      data.todayCommission =( (await CoinTransaction.sum('amount',{
        where:{
          message:"commission",
          createdAt: {
            [Op.and]: [
              {
                [Op.gte]: todayStartDate,
              },
              {
                [Op.lte]: todayEndDate,
              },
            ],
          },
        }
      }))) || 0;

      data.penaltyCoins = (await CoinTransaction.sum('amount',{
        where:{
          message:"penalty"
        }
      })) || 0
    // const requests = await Request.findAndCountAll({
    //   where:{
    //     status:"accepted",
    //     createdAt:{
    //       [Op.and]:[
    //         {
    //           [Op.gte]:startDate

    //         },
    //         {
    //           [Op.lte]:endDate

    //         }

    //       ]
    //     },
    //   },
    //   raw:true
    // })
    // let requestsData = requests.rows.filter((row)=>{console.log(row.createdAt);if(row.createdAt >= startDate && row.createdAt <= endDate)return row})
    // console.log(requests.rows);
    return data;
  }
}

module.exports = new adminServices();
