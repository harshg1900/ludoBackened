var express = require('express');
const adminController = require("../controller/adminController")
const userAuthController = require('../controller/userAuthController');
const { verifyRole, verifyPermission } = require('../middlewares/authMiddleware');
const { permission } = require('../constants');
const adminRouter = express.Router()

adminRouter.post("/coinrequests/action",verifyPermission(permission.add_coins),adminController.updateCoinRequest) //TODO
adminRouter.get("/coinrequests",adminController.getCoinRequests)

adminRouter.post("/withdrawrequest/action",verifyPermission(permission.withdraw_coins),adminController.updateWithdrawRequest)
adminRouter.get("/withdrawrequest",adminController.getWithdrawRequest)

adminRouter.post("/challengeresults/action",verifyPermission(permission.challenge_result),adminController.updateChallengeResult)
adminRouter.get("/challengeresults",verifyRole("admin"),adminController.getChallengeResults)
adminRouter.post("/block",verifyPermission(permission.block_user),adminController.blockUser)
adminRouter.get("/all",adminController.getAllAdmins)
adminRouter.post("/changepassword",userAuthController.changepassword)
adminRouter.post("/dashboard",adminController.getDashboardData)
adminRouter.get("/profile/:adminId",adminController.getProfilebyId)

adminRouter.get("/penalties",adminController.getPenalties)
adminRouter.put("/penalties",verifyPermission(permission.settings),adminController.updatePenalties)

// adminRouter.post("/login",adminController.login)

adminRouter.post("/createadmin",verifyPermission(permission.manage_admin),adminController.createAdmin)
adminRouter.post("/updateadminstatus",verifyPermission(permission.manage_admin),adminController.updateAdminActiveStatus)

adminRouter.get("/permissions",adminController.getPermissions)
adminRouter.post("/permissions",verifyPermission(permission.manage_admin),adminController.updatePermission)


module.exports = adminRouter