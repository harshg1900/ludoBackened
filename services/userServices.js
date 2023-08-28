const { Api404Error, ApiBadRequestError } = require("../errors");
const logger = require("../logger");
const { UserAuthentication, Referral, Wallet, Challenge, Result } = require("../models")
const { User } = require("../models/User")
const bcrypt = require("bcrypt");
const { generateCode } = require("../utils");

class userServices{
    async createUser(uid,role,password,name,username,referral){
        const userAuth = await UserAuthentication.findByPk(uid);
        
        if(!userAuth.is_phone_verified || !userAuth.is_email_verified){
            throw new ApiBadRequestError("Phone or email is not verified, please verify that first")
        }
        const salt = await bcrypt.genSaltSync(10);
        password = bcrypt.hashSync(password, salt);
        logger.debug(password)
        // con
        const rslt = await User.create({
            id:uid,
            role,
            phone:userAuth.phone,
            email:userAuth.email,
            password:password,
            name:name,
            username,
            referralCode:generateCode(10),
            ...(referral&&{referral})
            
            
        })
        if(referral){

            const referraluser = await this.getReferrerUser(referral);

            await Referral.create({
                userA:referraluser,
                userB:rslt.id
            })
            rslt.referral = referraluser.id
            await rslt.save()
        }
        userAuth.isCreated = true;
        await userAuth.save()
        return rslt;
    }
    async validPassword (passwordToVerify,userPassword) {
        return bcrypt.compareSync(passwordToVerify, userPassword);
      }

    async getReferrerUser(referralCode){
        const user = await User.findOne({
            where:{
                referralCode
            }
        })

        return user
    }
    async getUserById(uid){
        const user = await User.findOne({
            where:{
                id:uid
            },
            attributes:{
                exclude:["password"]
            },
            include:[
                {
                    model: Wallet
                },
                {
                    model:Challenge,
                    include:[
                        {
                            model:Result
                        }
                    ]
                }
            ]
        })
        if(!user){
            throw new Api404Error("No User found with given id");
        }
        return user
    }
    async getAllUsers(){
        const rslt = await User.findAndCountAll({
            attributes:{
                exclude:["password"]
            },
            include:[
                {
                    model: Wallet
                },
                {
                    model:Challenge,
                    include:[
                        {
                            model:Result
                        }
                    ]
                }
            ]
            
        })
        return rslt;
    }
}
module.exports = new userServices()