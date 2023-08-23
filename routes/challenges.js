var express = require('express');
const { createChallenge, getChallenges, acceptChallenge,deleteChallenge } = require('../controller/challengeController');
const challengeRouter = express.Router();

challengeRouter.post("/",createChallenge)
challengeRouter.get("/",getChallenges)
challengeRouter.post("/accept",acceptChallenge)
challengeRouter.delete("/:challengeId",deleteChallenge)
module.exports = challengeRouter