const asyncHandler = require("express-async-handler");
const walletServices = require("../services/walletServices");



exports.getWallet = asyncHandler(async(req,res)=>{
    const rslt = await walletServices.getWallet(req.user.uid)
})