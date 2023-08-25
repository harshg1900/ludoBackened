var express = require('express');
const adminController = require("../controller/adminController")
const userAuthController = require('../controller/userAuthController');
const adminRouter = express.Router()

adminRouter.post("/coinrequests/action",adminController.updateCoinRequest) //TODO
adminRouter.get("/coinrequests",adminController.getCoinRequests)

adminRouter.post("/withdrawrequest/action",adminController.updateWithdrawRequest)
adminRouter.get("/withdrawrequest",adminController.getWithdrawRequest)

adminRouter.post("/challengeresults/action",adminController.updateChallengeResult)
adminRouter.get("/challengeresults",adminController.getChallengeResults)
adminRouter.post("/block",adminController.blockUser)
adminRouter.get("/all",adminController.getAllAdmins)
adminRouter.post("/changepassword",userAuthController.changepassword)
adminRouter.get("/dashboard",adminController.getDashboardData)
adminRouter.get("/profile/:adminId",adminController.getProfilebyId)
// adminRouter.post("/login",adminController.login)

adminRouter.post("/createadmin",adminController.createAdmin)
adminRouter.post("/updateadminstatus",adminController.updateAdminActiveStatus)

adminRouter.get("/:adminId/permissions")
adminRouter.post("/:adminId/permissions")


module.exports = adminRouter