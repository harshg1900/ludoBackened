const {
    UserAuthentication,
  } = require("./UserAuthentication");


const {User} = require("./User"); 
const { Result, Challenge } = require("./Challenge");
const { Wallet } = require("./Wallet");
const { CoinTransaction,MoneyTransaction } = require("./Transaction");
const { Referral } = require("./Referral");
const { Request } = require("./Request");
const { WithdrawRequest } = require("./Withdraw");



  module.exports = {
    UserAuthentication,
    User,
    Challenge,
    Result,
    Wallet,
    CoinTransaction,
    Referral,
    MoneyTransaction,
    Request,
    WithdrawRequest,
  } 