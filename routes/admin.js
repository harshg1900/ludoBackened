var express = require('express');
const adminController = require("../controller/adminController")
const userAuthController = require('../controller/userAuthController');
const { verifyRole } = require('../middlewares/authMiddleware');
const adminRouter = express.Router()

adminRouter.post("/coinrequests/action",adminController.updateCoinRequest) //TODO
adminRouter.get("/coinrequests",adminController.getCoinRequests)

adminRouter.post("/withdrawrequest/action",adminController.updateWithdrawRequest)
adminRouter.get("/withdrawrequest",adminController.getWithdrawRequest)

adminRouter.post("/challengeresults/action",adminController.updateChallengeResult)
adminRouter.get("/challengeresults",verifyRole("admin"),adminController.getChallengeResults)
adminRouter.post("/block",adminController.blockUser)
adminRouter.get("/all",adminController.getAllAdmins)
adminRouter.post("/changepassword",userAuthController.changepassword)
adminRouter.post("/dashboard",adminController.getDashboardData)
adminRouter.get("/profile/:adminId",adminController.getProfilebyId)

adminRouter.get("/penalties",adminController.getPenalties)
adminRouter.put("/penalties",adminController.updatePenalties)

// adminRouter.post("/login",adminController.login)

adminRouter.post("/createadmin",adminController.createAdmin)
adminRouter.post("/updateadminstatus",adminController.updateAdminActiveStatus)

adminRouter.get("/:adminId/permissions")
adminRouter.post("/:adminId/permissions")


module.exports = adminRouter