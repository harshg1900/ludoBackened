var express = require('express');
const userAuthController = require('../controller/userAuthController');
const userController = require('../controller/userController');
const { isVerifiedUser } = require('../middlewares/authMiddleware');
const { fileUpload } = require('../config/multerConfig');
const userRouter = express.Router();


/* GET users listing. */
// userRouter.post('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
userRouter.post("/otp",userAuthController.sendOTP)
userRouter.post("/verify",userAuthController.verifyOTP)
userRouter.post("/",isVerifiedUser,userController.createUser)
userRouter.post("/login",userAuthController.login)
userRouter.post("/wallet/moneyrequest",isVerifiedUser,fileUpload.single('file'),userController.addCoinRequest)
userRouter.get("/wallet/moneyrequest",isVerifiedUser,userController.addCoinRequest)

module.exports = userRouter;
