const asyncHandler = require("express-async-handler");
const walletServices = require("../services/walletServices");
const { Wallet, WithdrawRequest } = require("../models");
const { ApiBadRequestError } = require("../errors");



exports.getWallet = asyncHandler(async(req,res)=>{
    const rslt = await walletServices.getWallet(req.user.uid)
    res.status(200).json({data:rslt})
})
exports.withdrawMoneyRequest = asyncHandler( async(req,res)=>{
    const {amount,details} = req.body;

    const wallet = await Wallet.findOne({
        where:{

            userId:req.user.uid
        }
        
    })
    if(wallet.amount < amount){
        throw new ApiBadRequestError("Insufficient Balance")
    }

    const request = await WithdrawRequest.create({
        userId:req.user.uid,
        amount,
        details,
        status:"pending"
    })
    res.status(200).json({status:200,message:"Request generated to admin successfully",data:request})

})