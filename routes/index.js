var express = require('express');
var router = express.Router();
const userRouter = require("./users");
const challengeRouter = require("./challenges");
const { isVerifiedUser } = require('../middlewares/authMiddleware');
/* GET home page. */
router.get("/health-check", (req, res) => {
  res
    .status(200)
    .send(
      "API response? You got it! No need to keep refreshing, it's all good. 10/10, would serve again."
    );
});
// router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/challenge",isVerifiedUser, challengeRouter);

module.exports = router;
