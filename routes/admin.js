var express = require('express');
const adminRouter = express.Router()

adminRouter.post("/coinrequests/action")
adminRouter.get("/coinrequests")

adminRouter.post("/withdrawrequest/action")
adminRouter.get("/withdrawrequest")

adminRouter.post("/challengeresults/action")
adminRouter.get("/challengeresults")

module.exports = adminRouter