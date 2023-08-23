var express = require('express');
const adminController = require("../controller/adminController")

const adminRouter = express.Router()

adminRouter.post("/coinrequests/action")
adminRouter.get("/coinrequests")

adminRouter.post("/withdrawrequest/action")
adminRouter.get("/withdrawrequest")

adminRouter.post("/challengeresults/action")
adminRouter.get("/challengeresults")

adminRouter.get("/users")


// adminRouter.post("/login",adminController.login)

adminRouter.post("/createadmin",adminController.createAdmin)
adminRouter.post("/updateadminstatus")

adminRouter.get("/permissions")
adminRouter.post("/permissions")

module.exports = adminRouter