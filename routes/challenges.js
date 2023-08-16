var express = require('express');
const { createChallenge, getChallenges, acceptChallenge } = require('../controller/challengeController');
const challengeRouter = express.Router();

challengeRouter.post("/",createChallenge)
challengeRouter.get("/",getChallenges)
challengeRouter.post("/accept",acceptChallenge)
module.exports = challengeRouter