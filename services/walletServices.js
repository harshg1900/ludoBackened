const { Wallet, Request } = require("../models")

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
}
module.exports = new walletServices()