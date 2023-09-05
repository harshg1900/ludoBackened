const asyncHandler = require("express-async-handler");
const { ApiBadRequestError, ApiUnathorizedError } = require("../errors");
const challengeServices = require("../services/challengeServices");
const { challengeCategories } = require("../constants");
const walletServices = require("../services/walletServices");
const { Result, Challenge, CoinTransaction } = require("../models");

exports.createChallenge = asyncHandler(async(req,res)=>{
    const {category,price,roomcode} = req.body;
    const challenger = req.user.uid;


    if(!category || !price || !challenger || !roomcode){
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
    const rslt = await challengeServices.createChallenge(challenger,category,price,roomcode)
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

exports.deleteChallenge = asyncHandler(async(req,res)=>{
    await challengeServices.deleteChallenge(req.user.uid,req.params.challengeId);
    res.status(203).json({status:200,message:"Challenge Deleted successfully"})
})

exports.createResult = asyncHandler(async(req,res)=>{
    const {victory,challengeId} = req.body;    
    const link = req.file?.link
    const userId = req.user.uid
    console.log( req.body.challengeId);
    console.log(req.file)

    const result = await Result.findOne({
        where:{
            challengeId
        }
    })
    const challenge = await Challenge.findOne({
        where:{
            id:challengeId
        }
    })

    if(challenge.status == 'created'){
        throw new ApiUnathorizedError("The challenge has not begun yet.")
    }
    if(challenge.status == "completed"){
        throw new ApiBadRequestError("The challenge has already completed")
    }


    if(userId == challenge.acceptor){
        result.acceptor_responded = true;
        await result.save()
        console.log("challenger_responded",challenge.challenger_responded,victory);
        if(result.challenger_responded){
            if(victory){
                if( result.challenger_input ){ //conflict
                    challenge.status = "judgement"
                    result.acceptor_input = true;
                    result.acceptor_image = link;
                    await challenge.save()
                    await result.save()
                    res.status(200).json({status:200,message:"The opponent has also claimed victory. Request sent to Admin !!!"})
                    

                }
                else{ //challenge.acceptor is winner
                    challenge.status = "completed"
                    result.Winner = userId
                    result.acceptor_image = link;
                    await challenge.save()
                    await result.save()
                    const award =
                        2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, userId);
                    await walletServices.addCoins(award, userId, "earned");
                    await walletServices.addCoins((await walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:userId,
                        receiver:1,
                        message:"commission"
                    })
                    await CoinTransaction.create({
                        sender:challenge.challenger,
                        receiver:userId,
                        message:"challenge result"
                      })
                    res.status(200).json({status:200,message:"You are the winner !!!"})

                }
                
    
            }
            else{
                if(!result.challenger_input){ //both said I lose
                    challenge.status = "completed"
                    result.Winner = userId
                    await challenge.save()
                    await result.save()
                    const award =
                        2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, userId);
                    await walletServices.addCoins(award, userId, "earned");
                    await walletServices.addCoins((walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:userId,
                        receiver:1,
                        message:"commission"
                    })
                    await CoinTransaction.create({
                        sender:challenge.challenger,
                        receiver:userId,
                        message:"challenge result"
                      })
                    res.status(200).json({status:200,message:"The opponent has already claimed defeat. You are the winner !!!"})
                }
                else{ //person accepted defeat
    
                    challenge.status = "completed"
                    result.Winner = challenge.challenger
                    
                    await challenge.save()
                    await result.save()
                    await CoinTransaction.create({
                        sender:challenge.acceptor,
                        receiver:challenge.challenger,
                        message:"challenge result"
                      })
                    //admin
                    const award =
                    2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, challenge.challenger);
                    await walletServices.addCoins(award, challenge.challenger, "earned");
                    await walletServices.addCoins((walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:challenge.challenger,
                        receiver:1,
                        message:"commission"
                    })  
                    res.status(200).json({status:200,message:"Better Luck Next Time !!!"})

                
                }
                
            }
        }
        else{
            if(victory){
                challenge.status = "judgement"
                    result.acceptor_input = true;
                    result.acceptor_image = link;
                    await challenge.save()
                    await result.save()

                    res.status(200).json({status:200,message:"Victory claimed. Waiting for opponent response !!!"})
                

            }
            else{
                result.acceptor_input = false
                await result.save()
                res.status(200).json({status:200,message:"Better Luck Next Time !!!"})
            }
        }
    }
    else{
        result.challenger_responded = true;
        await result.save()
        if(result.acceptor_responded){
            if(victory){
                if( result.acceptor_input ){ //conflict
                    challenge.status = "judgement"
                    result.challenger_input = true;
                    result.challenger_image = link;
                    await challenge.save()
                    await result.save()

                    res.status(200).json({status:200,message:"The opponent has also claimed victory. Request sent to Admin !!!"})

                }
                else{ //challenge.acceptor is winner
                    challenge.status = "completed"
                    result.Winner = userId
                    result.challenger_image = link
                    await challenge.save()
                    await result.save()
                    const award =
                        2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, userId);
                    await walletServices.addCoins(award, userId, "earned");
                    await walletServices.addCoins((walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:userId,
                        receiver:1,
                        message:"commission"
                    })
                    await CoinTransaction.create({
                        sender:challenge.acceptor,
                        receiver:userId,
                        message:"challenge result"
                      })

                      res.status(200).json({status:200,message:"You are the winner !!!"})
                }
                
    
            }
            else{
                if(!result.acceptor_input){ //both said I lose
                    challenge.status = "completed"
                    result.Winner = userId
                    await challenge.save()
                    await result.save()
                    const award =
                        2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, userId);
                    await walletServices.addCoins(award, userId, "earned");
                    await walletServices.addCoins((walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:userId,
                        receiver:1,
                        message:"commission"
                    })
                    await CoinTransaction.create({
                        sender:challenge.acceptor,
                        receiver:userId,
                        message:"challenge result"
                      })
                    res.status(200).json({status:200,message:"The opponent has already claimed defeat. You are the winner !!!"})
                }
                else{ //person accepted defeat
    
                    challenge.status = "completed"
                    result.Winner = challenge.acceptor
                    
                    await challenge.save()
                    await result.save()
                    await CoinTransaction.create({
                        sender:challenge.challenger,
                        receiver:challenge.acceptor,
                        message:"challenge result"
                      })
                    //admin
                    const award =
                    2 * parseInt(challenge.price) - (walletServices.getCommission()) * parseInt(challenge.price);
                    await walletServices.addCoins(award, challenge.acceptor);
                    await walletServices.addCoins(award, challenge.acceptor, "earned");
                    await walletServices.addCoins((walletServices.getCommission()) * parseInt(challenge.price), 1);
                    await CoinTransaction.create({
                        sender:challenge.acceptor,
                        receiver:1,
                        message:"commission"
                    })  
                    res.status(200).json({status:200,message:"Better Luck Next Time !!!"})
                }
                
            }
        }
        else{
            if(victory){
                challenge.status = "judgement"
                    result.challenger_input = true;
                    result.challenger_image = link;
                    await challenge.save()
                    await result.save()
                    res.status(200).json({status:200,message:"Victory claimed, waiting for opponent response !!!"})

            }
            else{
                result.challenger_input = false
                await result.save()
                res.status(200).json({status:200,message:"Better Luck Next Time !!!"})
            }
        }




    }

})
