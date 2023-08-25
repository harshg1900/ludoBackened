const asyncHandler = require("express-async-handler");
const walletServices = require("../services/walletServices");
const { Wallet } = require("../models");



exports.getWallet = asyncHandler(async(req,res)=>{
    const rslt = await walletServices.getWallet(req.user.uid)
    res.status(200).json({data:rslt})
})
exports.withdrawMoneyRequest = asyncHandler( async(req,res)=>{
    const wallet = await Wallet.findOne({
        
    })
})