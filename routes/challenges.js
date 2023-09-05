var express = require('express');
const { createChallenge, getChallenges, acceptChallenge,deleteChallenge,createResult,gamesPlayed } = require('../controller/challengeController');
const { fileUpload } = require('../config/multerConfig');
const challengeRouter = express.Router();

challengeRouter.post("/",createChallenge)
challengeRouter.get("/",getChallenges)
challengeRouter.post("/accept",acceptChallenge)
challengeRouter.post("/result",fileUpload.single('file'),createResult)
challengeRouter.get("/played/:userId",gamesPlayed)
challengeRouter.get("/played",gamesPlayed)
challengeRouter.delete("/:challengeId",deleteChallenge)

module.exports = challengeRouter