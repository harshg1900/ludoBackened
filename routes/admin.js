var express = require('express');
const adminController = require("../controller/adminController")

const adminRouter = express.Router()

adminRouter.post("/coinrequests/action",adminController.updateCoinRequest) //TODO
adminRouter.get("/coinrequests",adminController.getCoinRequests)

adminRouter.post("/withdrawrequest/action",adminController.updateWithdrawRequest)
adminRouter.get("/withdrawrequest",adminController.getWithdrawRequest)

adminRouter.post("/challengeresults/action")
adminRouter.get("/challengeresults",adminController.getChallengeResults)

adminRouter.get("/all")


// adminRouter.post("/login",adminController.login)

adminRouter.post("/createadmin",adminController.createAdmin)
adminRouter.post("/updateadminstatus")

adminRouter.get("/:adminId/permissions")
adminRouter.post("/:adminId/permissions")

module.exports = adminRouter