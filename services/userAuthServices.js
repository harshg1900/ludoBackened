const { ApiBadRequestError, ApiUnathorizedError } = require("../errors");
const logger = require("../logger");
const { UserAuthentication, User } = require("../models/index");
const { generateRandomNumber } = require("../utils");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./mail");
const unirest = require("unirest");
class userAuthServices {
  async sendEmailOTP(email, phone, role) {
    let otp = generateRandomNumber(1000, 9999);
    const existingUser = await UserAuthentication.findOne({
      where: {
        phone,
        role,
      },
    });
    if (!existingUser || !existingUser.is_phone_verified) {
      throw new ApiBadRequestError(
        `The phone number ${phone} is not verified, please verify it first.`
      );
    }
    const existingEmail = await UserAuthentication.findOne({
      where: {
        email,
      },
    });
    if (existingEmail && existingEmail.phone != phone) {
      if (existingEmail.is_email_verified) {
        throw new ApiBadRequestError(
          "Email already in use with different phone number"
        );
      } else {
        existingEmail.email = null;
        await existingEmail.save();
      }
    }
    let expirationTimeInMilliseconds =
      new Date().getTime() + 60000 * process.env.OTP_EXPIRATION;
    let expirationTime = new Date(expirationTimeInMilliseconds);
    existingUser.email_otp = otp;
    existingUser.email_expirationTime = expirationTime;
    existingUser.email = email;
    await existingUser.save();
    (process.env.NODE_ENV == "production" || true)
      ? await sendEmail(
          email,
          "OTP for Email Verification",
          `<div class="container">
      <h1>LudoKavish Onboarding</h1>
      <p>Hi,</p>
      <p>Thank you for signing up on LudoKavish! We're excited to have you on board and will be happy to help you set everything up.</p>
      <div class="otp">${otp}</div>
      <p>The LudoKavish Team</p>
      <p class="footer">If you didn't create this account or have authentication-related issues, please let us know by replying to this email.</p>
    </div>`
        )
      : 1 == 1;

    return { message: "OTP send on your email " + email };
  }

  //--------------------------------
  async sendForgetEmailOTP(email, role) {
    let otp = generateRandomNumber(1000, 9999);
    const existingUser = await UserAuthentication.findOne({
      where: {
        email,
        isCreated: true,
      },
    });
    if (!existingUser) {
      throw new ApiBadRequestError(
        `The user is not created, please create it first.`
      );
    }
    const existingEmail = await UserAuthentication.findOne({
      where: {
        email,
      },
    });
    if (existingEmail && existingEmail.phone != phone) {
      if (existingEmail.is_email_verified) {
        throw new ApiBadRequestError(
          "Email already in use with different phone number"
        );
      } else {
        existingEmail.email = null;
        await existingEmail.save();
      }
    }
    let expirationTimeInMilliseconds =
      new Date().getTime() + 60000 * process.env.OTP_EXPIRATION;
    let expirationTime = new Date(expirationTimeInMilliseconds);
    existingUser.email_otp = otp;
    existingUser.email_expirationTime = expirationTime;
    existingUser.email = email;
    await existingUser.save();
    (process.env.NODE_ENV == "production" || true)
      ? await sendEmail(
          email,
          "OTP for Email Verification",
          `<div class="container">
      <h1>LudoKavish Onboarding</h1>
      <p>Hi,</p>
      <p>Thank you for signing up on LudoKavish! We're excited to have you on board and will be happy to help you set everything up.</p>
      <div class="otp">${otp}</div>
      <p>The LudoKavish Team</p>
      <p class="footer">If you didn't create this account or have authentication-related issues, please let us know by replying to this email.</p>
    </div>`
        )
      : 1 == 1;

    return { message: "OTP send on your email " + email };
  }

  //--------------------------------

  async sendPhoneOTP(phone, role) {
    let otp = generateRandomNumber(1000, 9999);
    let expirationTimeInMilliseconds =
      new Date().getTime() + 60000 * process.env.OTP_EXPIRATION;
    let expirationTime = new Date(expirationTimeInMilliseconds);
    let [checkuser, created] = await UserAuthentication.findOrCreate({
      where: {
        phone,
      },
      defaults: {
        phone,
        phone_otp: otp,
        phone_expirationTime: expirationTime,
        role,
      },
    });
    // console.log(checkuser,created);
    if (!created) {
      if (checkuser.isCreated) {
        throw new ApiBadRequestError("Phone already in use. Please Login");
      }
      checkuser.phone_otp = otp;
      checkuser.role = role;
      checkuser.phone_expirationTime = expirationTime;
      await checkuser.save();
    }
    const otpStatus = await this.sendOTP(phone, otp);

    // const otpStatus = true;
    logger.info(`SMS OTP is : ${otp}`);
    if (otpStatus ) {
      return {
        message: "OTP send on your phone number " + phone,
        // user: checkuser,
      };
    } 
  }

  //--------------------------------
  async verifyPhoneOTP(phone, OTP, role) {
    const checkUser = await UserAuthentication.findOne({
      where: {
        phone,
        role,
      },
    });
    if (!checkUser) {
      throw new ApiBadRequestError(
        "No user found with provided role and phone number."
      );
    }
    if (
      new Date(checkUser.phone_expirationTime).getTime() < new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has Expired");
    }
    // if (checkUser.phone_otp == OTP || process.env.NODE_ENV == "development") {
    if (checkUser.phone_otp == OTP ) {
      checkUser.is_phone_verified = true;
      await checkUser.save();
      return [true]
    }
    else return [false];
  }

  //--------------------------------

  async verifyEmailOTP(phone, email, OTP, role) {
    console.log("here");
    const checkUser = await UserAuthentication.findOne({
      where: {
        phone,
        email,
        role,
      },
    });
    if (!checkUser) {
      throw new ApiBadRequestError(
        "No user found with provided role, email and phone number."
      );
    }
    if (
      new Date(checkUser.email_expirationTime).getTime() < new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has Expired");
    }
    console.log("OTP",String(checkUser.email_otp),String(OTP),String(checkUser.email_otp) == String(OTP) );
    // if (checkUser.email_otp == OTP || true) {
    if (String(checkUser.email_otp) == String(OTP) ) {
      checkUser.is_email_verified = true;
      await checkUser.save();
      return [true,checkUser]
    }
    else{

      return [false];
    }
  }
  //--------------------

  async verifyForgetEmailOTP(email, OTP, role) {
    console.log("here");
    const checkUser = await UserAuthentication.findOne({
      where: {
        email,
        role,
        isCreated: true,
      },
    });
    if (!checkUser) {
      throw new ApiBadRequestError(
        "No user found with provided role, email and phone number."
      );
    }
    if (
      new Date(checkUser.email_expirationTime).getTime() < new Date().getTime()
    ) {
      throw new ApiBadRequestError("OTP has Expired");
    }
    // if (checkUser.email_otp == OTP || true) {
      if (String(checkUser.email_otp) == String(OTP) ) {
        checkUser.is_email_verified = true;
        await checkUser.save();
      }
      return checkUser;
    }
  //--------------------
  async getAccessToken(user) {
    const token = jwt.sign(user, process.env.JWT_TOKEN_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION_TIME,
    });
    return token;
  }

  //----------------
  async login(email, password) {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ApiUnathorizedError(
        "Given email/password combination is invalid"
      );
    }
    const salt = await bcrypt.genSaltSync(10);
    // logger.debug("user",user)
    // logger.debug(password,user.password)
    const verified = await bcrypt.compare(password, user.password);
    if (verified) {
      if(user.blocked){
        throw new ApiUnathorizedError("You are blocked from the platform.")
      }
      const userWithoutPassword = { ...user.toJSON() };
      delete userWithoutPassword.password;
      return {
        token: await this.getAccessToken({ uid: user.id, role: user.role }),
        user: userWithoutPassword,
      };
    } else {
      throw new ApiUnathorizedError(
        "Given email/password combination is invalid"
      );
    }
  }

  // UTILS - DO NOT MESS
  async sendOTP(mobileNo, OTP) {
    return this.fasttosms(mobileNo, OTP);
    // return true;
  }

  // async sendEmail(to, subject, message, from) {
  //   const params = {
  //     Destination: {
  //       ToAddresses: [to],
  //     },
  //     Message: {
  //       Body: {
  //         Html: {
  //           Charset: "UTF-8",
  //           Data: message,
  //         },
  //       },
  //       Subject: {
  //         Charset: "UTF-8",
  //         Data: subject,
  //       },
  //     },
  //     ReturnPath: from ? from : config.aws.ses.from.default,
  //     Source: from ? from : config.aws.ses.from.default,
  //   };

  //   let data = await SES.sendEmail(params, (err, data) => {
  //     if (err) {
  //       throw err;
  //     } else {
  //       return data;
  //     }
  //   });
  //   return data;
  // }



  async fasttosms(mobileNo, OTP) {
    var req = unirest("POST", "https://www.fast2sms.com/dev/bulkV2");
    console.log(mobileNo, OTP);
    req.headers({
      authorization: process.env.FAST_SMS,
    });

    req.form({
      variables_values: `${OTP}`,
      route: "otp",
      numbers: `${String(mobileNo).substring(2)}`,
    });

    req.end(function (res) {
      // console.log(res);]
      console.log(req);
      console.log(res.body);
      if (res.error) throw new Error(res.error);
    });
    return true;
  }
}
module.exports = new userAuthServices();
