const { sequelize, Op } = require("../config/db");
const { ApiBadRequestError, Api404Error } = require("../errors");
const logger = require("../logger");
const { Wallet, Request, MoneyTransaction, User, CoinTransaction } = require("../models")

class walletServices{
    async createWallet(userId){
        const wallet = await Wallet.create({
            userId
        })
        return wallet
    }
    async addCoinRequest(uid,amount,link){
        const rslt = await Request.create({
            userId:uid,
            amount,
            image:link
        })

//TODO - Remove this in prod
        // await this.addCoins(amount,uid)

//Remove till here

        return rslt;
    }
    async getCoinRequest(uid){
        const rslt = await Request.findAll({
            where:{
                userId:uid
            }
        })
        return rslt
    }
    async addCoins(amount,uid,type){
        const wallet = await Wallet.findOne({
            where:{
                userId:uid
            }
        })
        if(!type){

            wallet.amount  = parseInt(wallet.amount) + parseInt(amount);
        }
        else{

            if(type == "earned"){
                wallet["earned"] = parseInt(wallet["earned"]) + parseInt(amount);
            }
            if(type == "bought"){
                wallet["bought"] =parseInt(wallet["bought"]) + parseInt(amount);
            }
            
        }
        await wallet.save();
        return wallet
    }
    async withdrawCoins(amount,uid,type){
        const wallet = await Wallet.findOne({
            where:{
                userId:uid
            }
        })
        amount = parseInt(amount)

        if(!type){
            console.log(amount,wallet?.amount);
            if(parseInt(wallet.amount) < amount){
                throw new ApiBadRequestError("Insufficient Balance!!")
            }
            wallet.amount = parseInt(wallet.amount)- parseInt(amount);
        }
        else{

            if(type == "withdrawn"){
                wallet["withdrawn"] = parseInt(wallet["withdrawn"])+ parseInt(amount);
            }
            if(type == "lost"){
                wallet["lost"] = parseInt(wallet["lost"])+ parseInt(amount);
            }
            if(type == "penalty"){
                wallet["penalty"] =parseInt(wallet["penalty"]) + parseInt(amount);
            }
        }
        await wallet.save();
        return wallet.amount;
    }
    async getTransactions(uid){
        const moneyTransaction = await MoneyTransaction.findAll({
            where:{
                [Op.or]:[
                    {
                        sender:uid
                    },
                    {
                        receiver:uid
                    }
                ],
            
            },
            include:[
                {
                    model:User,
                    as:"Receiver",
                    attributes:["username","id","role"]
                },
                {
                    model:User,
                    as:"Sender",
                    attributes:["username","id","role"]
                },
            ]

        })
        const coinTransaction = await CoinTransaction.findAll({
            where:{
                [Op.or]:[
                    {
                        sender:uid
                    },
                    {
                        receiver:uid
                    }
                ],
            
            },
            include:[
                {
                    model:User,
                    as:"Receiver",
                    attributes:["username","id","role"]
                },
                {
                    model:User,
                    as:"Sender",
                    attributes:["username","id","role"]
                },
            ]

        })
        console.log(coinTransaction,moneyTransaction);
        return {coinTransaction,moneyTransaction}
    }

    async getWallet(uid){
        const wallet = await Wallet.findOne({
            where:{
                userId:uid
            }
        })
        if(!wallet){
            throw new Api404Error("No wallet found for the user")
        }
        return wallet
    }
}
module.exports = new walletServices()