const asyncHandler = require("express-async-handler");
const { ApiBadRequestError } = require("../errors");
const userServices = require("../services/userServices");
const walletServices = require("../services/walletServices");

exports.createUser = asyncHandler(async(req,res)=>{
    // console.log("user ",req.user)
    const {uid, role} = req.user
    if(!uid || !role){
        throw new ApiBadRequestError("Token Error userController, token not present")
    }
    const {password, name,username} = req.body
    if(!password){
        throw new ApiBadRequestError("Password is not present in request body")
    }
    if(!name){
        throw new ApiBadRequestError("name is not preset in the body")
    }
    if(!username){
        throw new ApiBadRequestError("name is not preset in the body")
    }

    const rslt = await userServices.createUser(uid,role,password,name,username,req.body.referral)
    const wallet = await walletServices.createWallet(rslt.id)
    res.status(201).json({data:{user:rslt}})

})

exports.addCoinRequest = asyncHandler(async(req,res)=>{
    console.log(req.file)
    amount = req.body.amount
    const rslt = await walletServices.addCoinRequest(req.user.uid,amount,req.file.link)
    res.status(200).json({status:201,message:"Request to add coins sent to admin",data:rslt})
})
exports.getCoinRequest = asyncHandler(async(req,res)=>{
    
    const rslt = await walletServices.addCoinRequest(req.user.uid,amount,req.file.link)
    res.status(200).json({status:200,message:"Requests fetched",data:rslt})
})

exports.getUserById = asyncHandler(async(req,res)=>{
    const userId = req.params.userId || req.user.uid
    const rslt = await userServices.getUserById(userId );
    res.status(200).json({status:200,message:"User fetched successfully",data:rslt})
})