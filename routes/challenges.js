var express = require('express');
const { createChallenge } = require('../controller/challengeController');
const challengeRouter = express.Router();

challengeRouter.post("/",createChallenge)
module.exports = challengeRouter