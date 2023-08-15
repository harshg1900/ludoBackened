const asyncHandler = require("express-async-handler");
const { ApiBadRequestError } = require("../errors");
const challengeServices = require("../services/challengeServices");
const { challengeCategories } = require("../constants");

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
    res.status(201).json({status:201,message:"Challenge has been created successfully",data:rslt})
})


