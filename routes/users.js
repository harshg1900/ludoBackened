var express = require('express');
const userAuthController = require('../controller/userAuthController');
const userController = require('../controller/userController');
const walletController = require('../controller/walletController');
const { isVerifiedUser, verifyRole } = require('../middlewares/authMiddleware');
const { fileUpload } = require('../config/multerConfig');
const userRouter = express.Router();


/* GET users listing. */
// userRouter.post('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
userRouter.post("/otp",userAuthController.sendOTP)
userRouter.post("/verify",userAuthController.verifyOTP)
userRouter.post("/login",userAuthController.login)
userRouter.post("/changepassword",isVerifiedUser,verifyRole('basic'),userAuthController.changepassword)
userRouter.get("/transaction",isVerifiedUser,userController.getTransactions)
userRouter.get("/all",isVerifiedUser,userController.getAllUsers)
userRouter.post("/wallet/withdrawrequest",walletController.withdrawMoneyRequest)
userRouter.post("/wallet/moneyrequest",isVerifiedUser,fileUpload.single('file'),userController.addCoinRequest)
userRouter.get("/wallet/moneyrequest",isVerifiedUser,userController.getCoinRequest)
userRouter.get("/wallet",isVerifiedUser,walletController.getWallet)

userRouter.get("/:userId",userController.getUserById)
userRouter.post("/",isVerifiedUser,userController.createUser)
userRouter.get("/",isVerifiedUser,userController.getUserById)


module.exports = userRouter;
