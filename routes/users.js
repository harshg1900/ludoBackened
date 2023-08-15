var express = require('express');
const { sendOTP, verifyOTP } = require('../controller/userAuthController');
const { createUser } = require('../controller/userController');
const { isVerifiedUser } = require('../middlewares/authMiddleware');
const userRouter = express.Router();


/* GET users listing. */
// userRouter.post('/', function(req, res, next) {
//   res.send('respond with a resource');
// });
userRouter.post("/otp",sendOTP)
userRouter.post("/verify",verifyOTP)
userRouter.post("/",isVerifiedUser,createUser)

module.exports = userRouter;
