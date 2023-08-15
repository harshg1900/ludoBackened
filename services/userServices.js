const { Api404Error, ApiBadRequestError } = require("../errors");
const logger = require("../logger");
const { UserAuthentication } = require("../models")
const { User } = require("../models/User")
const bcrypt = require("bcrypt");

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
            ...(referral&&{referral})
            

        })
        userAuth.isCreated = true;
        await userAuth.save()
        return rslt;
    }
    async validPassword (passwordToVerify,userPassword) {
        return bcrypt.compareSync(passwordToVerify, userPassword);
      }
}
module.exports = new userServices()