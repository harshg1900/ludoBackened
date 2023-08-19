const { Wallet } = require("../models")

class walletServices{
    async createWallet(userId){
        const wallet = await Wallet.create({
            userId
        })
        return wallet
    }
    

}
module.exports = new walletServices()