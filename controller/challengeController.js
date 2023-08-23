const asyncHandler = require("express-async-handler");
const { ApiBadRequestError } = require("../errors");
const challengeServices = require("../services/challengeServices");
const { challengeCategories } = require("../constants");
const walletServices = require("../services/walletServices");

exports.createChallenge = asyncHandler(async(req,res)=>{
    const {category,price} = req.body;
    const challenger = req.user.uid;


    if(!category || !price || !challenger){
        throw new ApiBadRequestError("Insufficient Data");
    }
    if(category == challengeCategories.QUICK){
        if(price <50 || price > 500){
            throw new ApiBadRequestError(`For ${challengeCategories.QUICK} mode, price should be more than 50 and less than 50.`)
        }
    }
    else if(category == challengeCategories.RICH){
        if(price < 500 || price > 20000){
            throw new ApiBadRequestError(`For ${challengeCategories.RICH} mode, price should be more than 500 and less than 20,000.`)
            
        }
    }
    const rslt = await challengeServices.createChallenge(challenger,category,price)
    console.log("rslt",rslt);
    
    // const responsedata = rslt.rslt
    // responsedata.balance = rslt.balance
    res.status(201).json({status:201,message:"Challenge has been created successfully",data:rslt})
})

exports.getChallenges = asyncHandler(async(req,res)=>{
    // const {limit = 100,offset = 0} = req.query
    const limit = req.query.limit || 100
    const offset = req.query.offset || 0;
    const {status, category, price,challenger,acceptor} = req.query;
    const rslt = await challengeServices.getChallenges(status,category,price,challenger,acceptor,limit,offset)
    res.status(200).json({status:200,message:"Challenges Returned",data:rslt});
})

exports.acceptChallenge = asyncHandler (async (req,res)=>{
    const acceptor = req.user.uid
    const challengeId = req.body.challengeId
    if(!challengeId){
        throw new ApiBadRequestError("Please send a challengeId in request body to accept.")
    }
    const rslt = await challengeServices.acceptChallenge(acceptor,challengeId);
   
    res.status(200).json({status:200,message:"Challenge Accepted",data:rslt})
    
})

exports.deleteChallenge = asyncHandler (async(req,res)=>{
    await challengeServices.deleteChallenge(req.user.uid,req.params.challengeId);
    res.status(203).json({status:200,message:"Challenge Deleted successfully"})
})

