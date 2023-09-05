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
    
    const rslt = await walletServices.getCoinRequest(req.user.uid)
    res.status(200).json({status:200,message:"Requests fetched",data:rslt})
})

exports.getUserById = asyncHandler(async(req,res)=>{
    const userId = req.params.userId || req.user.uid
    console.log((userId));
    const rslt = await userServices.getUserById(userId );
    res.status(200).json({status:200,message:"User fetched successfully",data:rslt })
})

exports.getTransactions = asyncHandler(async(req,res)=>{
    console.log(req.user.uid)
    const rslt = await walletServices.getTransactions(req.user.uid);
    res.status(200).json({status:200,message:"Transactions fetched successfully",data:rslt})
})

exports.getAllUsers = asyncHandler( async(req,res)=>{
    const rslt = await userServices.getAllUsers()
    res.status(200).json({status:200,message:"All users fetched successfully",data:rslt})

})

exports.updateProfile = asyncHandler( async(req,res)=>{
    if(req.body.name){
        await userServices.updateUserName(req.user.uid,req.body.name);
    }
    if(req.body.username){
        await userServices.updateUserusername(req.user.uid,req.body.username);
    }
    res.status(200).json({status:200,message:"User Updated successfully"})
})