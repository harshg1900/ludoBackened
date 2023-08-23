const asyncHandler = require("express-async-handler");
const { ApiBadRequestError } = require("../errors");
const adminServices = require("../services/adminServices");

exports.createAdmin = asyncHandler(async (req, res) => {
  const { phone, username, email, role, name, password } = req.body;
});

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

exports.createAdmin = asyncHandler(async(req,res)=>{
  const {phone,email,name,username,password} = req.body;
  if(!phone || !email || !name || !username || !password){
    throw new ApiBadRequestError("Insufficient info in request body " + req.body)
  }
  const rslt = await adminServices.createAdmin(phone,email,name,username,password)

  res.status(201).json({status:201,message:"Admin created successfully",data:rslt})
})

exports.getCoinRequests = asyncHandler( async(req,res)=>{
  console.log("hello");
  const rslt = await adminServices.getCoinRequests()
  res.status(200).json({status:200,message:"All addCoinrequests fetched",data:rslt})
})

exports.updateCoinRequest = asyncHandler( async(req,res)=>{
  
})

exports.getWithdrawRequest = asyncHandler( async(req,res)=>{
  const rslt = await adminServices.getWithdrawRequest()
  res.status(200).json({status:200,message:"All Withdraw Coin fetched",data:rslt})
})

exports