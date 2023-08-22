const { sequelize, Op } = require("../config/db");
const { ApiBadRequestError } = require("../errors");
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

            wallet.amount += amount;
        }
        else{

            if(type == "earned"){
                wallet["earned"] += amount;
            }
            if(type == "bought"){
                wallet["bought"] += amount;
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
        if(!type){
            if(wallet.amount < amount){
                throw new ApiBadRequestError("Insufficient Balance!!")
            }
            wallet.amount -= amount;
        }
        else{

            if(type == "withdrawn"){
                wallet["withdrawn"] += amount;
            }
            if(type == "lost"){
                wallet["lost"] += amount;
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
}
module.exports = new walletServices()