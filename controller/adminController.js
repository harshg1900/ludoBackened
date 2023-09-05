const asyncHandler = require("express-async-handler");
const { ApiBadRequestError, Api404Error } = require("../errors");
const adminServices = require("../services/adminServices");
const { Admin, User, Penalty } = require("../models");
const walletServices = require("../services/walletServices");

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiBadRequestError("email or passsword not present in the body");
  }
  console.log("hello");
  const rslt = await adminServices.login(email, password);
  res
    .status(200)
    .json({ status: 200, message: "Login successful", data: rslt });
});

exports.createAdmin = asyncHandler(async (req, res) => {
  const { phone, email, name, username, password } = req.body;
  if (!phone || !email || !name || !username || !password) {
    throw new ApiBadRequestError(
      "Insufficient info in request body " + req.body
    );
  }
  const rslt = await adminServices.createAdmin(
    phone,
    email,
    name,
    username,
    password
  );

  res
    .status(201)
    .json({ status: 201, message: "Admin created successfully", data: rslt });
});

exports.getCoinRequests = asyncHandler(async (req, res) => {
  console.log("hello");
  const rslt = await adminServices.getCoinRequests();
  res
    .status(200)
    .json({ status: 200, message: "All addCoinrequests fetched", data: rslt });
});

exports.updateCoinRequest = asyncHandler(async (req, res) => {
  const { id, message, status, amount } = req.body;
  const adminId = req.user.uid;
  if (!id || !message || !status || !amount) {
    throw new ApiBadRequestError("Insufficient Data in request body");
  }
  if (status != "accepted" && status != "rejected") {
    throw new ApiBadRequestError(
      `The status of the request should be set as accepted or rejected . You have sent ${status}.`
    );
  }
  const rslt = await adminServices.updateCoinRequest(
    id,
    message,
    status,
    adminId,
    amount
  );

  res.status(200).json({
    status: 200,
    message: `Given addCoinrequests is now ${status}`,
    data: rslt,
  });
});

exports.getWithdrawRequest = asyncHandler(async (req, res) => {
  const rslt = await adminServices.getWithdrawRequest();
  res
    .status(200)
    .json({ status: 200, message: "All Withdraw Coin fetched", data: rslt });
});

exports.getChallengeResults = asyncHandler(async (req, res) => {
  const rslt = await adminServices.getChallengeResults();
  res.status(200).json({
    status: 200,
    message: "All Challenge Results fetched",
    data: rslt,
  });
});

exports.updateWithdrawRequest = asyncHandler(async (req, res) => {
  const { id, message, status, amount } = req.body;
  const adminId = req.user.uid;
  if (!id || !message || !status || !amount) {
    throw new ApiBadRequestError("Insufficient Data in request body");
  }
  if (status != "accepted" && status != "rejected") {
    throw new ApiBadRequestError(
      `The status of the request should be set as accepted or rejected . You have sent ${status}.`
    );
  }
  const rslt = await adminServices.updateWithdrawRequest(
    id,
    message,
    status,
    adminId,
    amount
  );
  res.status(200).json({
    status: 200,
    message: `Given withdraw coin request is now ${status}`,
    data: rslt,
  });
});

exports.updateChallengeResult = asyncHandler(async (req, res) => {
  const { challengeId, winnerId, type } = req.body;
  const admin = req.user.uid;
  if (!challengeId || !winnerId || !type) {
    throw new ApiBadRequestError(
      `Insufficient information in body ${req.body}`
    );
  }
  const rslt = await adminServices.updateChallengeResult(
    challengeId,
    winnerId,
    admin,
    type
  );
  res.status(200).json({
    status: 200,
    message: `Given judge challenge result is now updated`,
    data: rslt,
  });
});

exports.getProfilebyId = asyncHandler(async (req, res) => {
  const { adminId } = req.params;
  if (!adminId) {
    throw new ApiBadRequestError("adminId is null");
  }
  const rslt = await Admin.findOne({
    where: {
      id: adminId,
    },
  });
  if (!rslt) {
    throw new Api404Error("No admin found with given Id");
  }
  res.status(200).json({
    status: 200,
    message: `Admin data fetched successfully`,
    data: rslt,
  });
});

exports.getAllAdmins = asyncHandler(async (req, res) => {
  const rslt = await Admin.findAll();
  if (!rslt) {
    throw new Api404Error("No admin found with given Id");
  }
  res.status(200).json({
    status: 200,
    message: `All Admin data fetched successfully`,
    data: rslt,
  });
});

exports.updateAdminActiveStatus = asyncHandler(async (req, res) => {
  const { status, adminId } = req.body;
  if (!adminId) {
    throw new ApiBadRequestError("adminId is null");
  }
  if (status != "active" && status != "inactive") {
    throw new ApiBadRequestError("status should be active or inactive");
  }
  const rslt = await Admin.findOne({
    where: {
      id: adminId,
    },
  });

  if (!rslt) {
    throw new Api404Error("No admin found with given Id");
  }
  rslt.status = status;
  await rslt.save();
  res.status(200).json({
    status: 200,
    message: `Admin status updated successfully`,
    data: rslt,
  });
});

exports.getDashboardData = asyncHandler(async (req, res) => {
  let { startDate, endDate } = req.body;
  if ((!startDate, !endDate)) {
    throw new ApiBadRequestError(
      "startDate or endDate is not present in the request"
    );
  }

  let dateString = startDate;
  let parts = dateString.split("-");
  let utcDateString = `${parts[2]}-${parts[1]}-${parts[0]}T00:00:00Z`;
  startDate = new Date(utcDateString);

  dateString = endDate;
  parts = dateString.split("-");
  utcDateString = `${parts[2]}-${parts[1]}-${parts[0]}T23:59:59Z`;
  endDate = new Date(utcDateString);
 

  // let dateString = startDate;
  // let parts = dateString.split("-");
  // startDate = new Date(parts[2], parts[1] - 1, parts[0]);
  // dateString = endDate;
  // parts = dateString.split("-");
  // endDate = new Date(parts[2], parts[1] - 1, parts[0], 23, 59, 59);
  console.log(startDate, endDate);
  let rslt = await adminServices.getDashboardData(startDate, endDate);
  res.status(200).json({
    status: 200,
    message: `All Admin data fetched successfully`,
    data: rslt,
  });
});

exports.blockUser = asyncHandler( async(req,res)=>{
  const userId = req.body.userId;
  const status = req.body.status 
  if(!userId){
    throw new ApiBadRequestError("No userId given in body")
  }
  if(status!= true && status != false){
    throw new ApiBadRequestError("Status should be true or false")
  }

  const rslt = await User.findOne({
    where:{
      id:userId
    }
  })
  if(!rslt){
    throw new Api404Error("No user found with given id")
  }
  rslt.blocked = status;
  await rslt.save();
  res.status(200).json({status:200,message:"User blocked status updated successfully !!!"})

})


exports.getPenalties = asyncHandler( async(req,res)=>{
   const rslt = await walletServices.getPenalties()
   res.status(200).json({status:200,message:"Penalties fetched successfully.",data:rslt})
})
exports.updatePenalties = asyncHandler( async(req,res)=>{
   const penalty = req.body;
   if(penalty.fraud == undefined || penalty.noupdate == undefined || penalty.wrongupdate == undefined || penalty.commission == undefined){
    throw new ApiBadRequestError("Please send complete penalty body(fraud,noupdate,wrongupdate,commission). You sent: " + penalty)
   }
   const rslt = await walletServices.updatePenalties(penalty)
   res.status(200).json({status:200,message:"Penalties fetched successfully.",data:rslt})
})