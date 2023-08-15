const asyncHandler = require("express-async-handler");
const { ApiBadRequestError } = require("../errors");
const userServices = require("../services/userServices");

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
    res.status(201).json({data:{user:rslt}})

})