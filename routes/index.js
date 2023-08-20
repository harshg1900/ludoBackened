var express = require('express');
var router = express.Router();
const userRouter = require("./users");
const challengeRouter = require("./challenges");
const { isVerifiedUser } = require('../middlewares/authMiddleware');
const { s3Client } = require('../config/awsConfig');
const { GetObjectCommand } = require('@aws-sdk/client-s3');
/* GET home page. */
router.get("/health-check", (req, res) => {
  res
    .status(200)
    .send(
      "API response? You got it! No need to keep refreshing, it's all good. 10/10, would serve again."
    );
});

router.get("/image/:key", async (req, res, next) => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.IMAGE_BUCKET,
      Key: req.params.key,
      
    });

    let response = await s3Client.send(command);
    response.Body?.pipe(res);
  } catch (err) {
    next(err);
  }
});
// router.use("/auth", authRouter);
router.use("/user", userRouter);
router.use("/challenge",isVerifiedUser, challengeRouter);

module.exports = router;
