const Userservices = require('../services/userServices');
const { compareSync } = require('bcryptjs');
const { Registration} = require('../models/userModel');
const sendResponse = require('../helper/responseSender');
const multer=require('multer');
const path=require('path');

const registerUser = async (req, res) => {
    const userDetails = req.body;
  try {
    let details = await Userservices.addUser(userDetails);
    if(details){
    console.log("Details", details);
    return sendResponse(res, 200, {
      status: true,
      data: details,
      message: 'Registration successful'
    });
  }else{
    return sendResponse(res, 200, { status: false, message: "Email already exists use another email" });
  }
  } catch (err) {
    console.log("errrrrrrrrrrrrrrrrr", err);
    return sendResponse(res, 500, { status: false, message: "Something went wrong" });
  }

};

const checkOTP = async (req, res) => {
  //console.log('entered otp:',req.body.otp);
  try{
  const user = await Userservices.checkOTP(req.body.id, req.body.otp);
  if (user)
  {
      if (req.body.query === 'signup') 
      {
        const user1 = await Userservices.updateVerificationStatus(req.body.id);
        // console.log("main", user1)
        let resobj = {
          user_id : user1._id,
          user_email_verify_status: user1.email_verify_status
        }
        let resobj1 = {
          user_id : user1._id,
        }
        console.log(resobj)
        if (user1.email_verify_status === 'true') {
          return sendResponse(res, 200, { status: true, data: resobj1, message: 'Verification Successful.' });
        }
        else {
          return sendResponse(res, 200, { status: false, message: "Entered OTP is invalid" });
        }
      }

    if (req.body.query === 'login') {

      // let user_data = await Userservices.updateLoginStatus(req.body.email);
      // if (user_data.login_status === 'true') {
      //   return sendResponse(res, 200, { status: true, data: user_data, message: 'Login Successful !!' });
      // }
      // return sendResponse(res, 200, { status: false, message: 'Entered OTP is invalid' });
      console.log(req.body)

      const user1 = await Registration.findOne({ _id : req.body.id });
        // console.log("main", user1)
        let resobj2 = {
          user_id : user1._id
        }
        let resobj1 = {
          user_id : user1._id
        }
        if (user) {
          return sendResponse(res, 200, { status: true, data: resobj2, message: 'Login Successful' });
        }
        else {
          return sendResponse(res, 200, { status: false, message: "Entered OTP is invalid" });
        }

    }
    if (req.body.query === 'forgetPassword') 
    {
        const user1 = await Registration.findOne({ _id : req.body.id });
        console.log("main", user1)
        let resobj = {
          user_id : user1._id
        }
        let resobj3 = {
          user_id : user1._id,
        }
        if (user) {
          return sendResponse(res, 200, { status: true, data: resobj3, message: 'Verification Successful.' });
        }
        else {
          return sendResponse(res, 200, { status: false, message: "Entered OTP is invalid" });
        }
      
    }
  }
  return sendResponse(res, 200, { status: false, message: "Incorrect OTP." });
  }catch(err){
    return sendResponse(res, 500, { status: false, message: "Something went wrong" });
  }
};

  const resendEmailOTP = async (req, res) => {
    const newOTP = await Userservices.newVerificationOTP(req.body.id);
    if (newOTP) {
      return sendResponse(res, 200, { status: true, data: { newOTP }, message: "OTP resent successfully." });
    }
    return sendResponse(res, 400, { status: false, message: "Error occured." });
  };

  var Storage=multer.diskStorage({
    destination:'./public/uploadfile',
    filename:(req,file,cb)=>{
      cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
    }
  })
  //middleware
  var upload=multer({
     storage:Storage
  }).single('file');
  
  //kyc update
  const kycUpdate=async function(req,res){
    console.log(req.body.id);
        let fileName= req.file.filename;
        console.log("File name:",fileName);
    try{
            let isUpdated=await Userservices.kycDataUpdate(fileName,req.body);
            if(isUpdated){
              return sendResponse(res, 200, { status: true, data: isUpdated, message: 'successfully uploded KYC' });
             }else{
              return sendResponse(res, 200, { status: false, message: 'Failed to upload KYC' });
             }
    }catch(err){
      return sendResponse(res,400,{status:false,message:"Something went wrong"});
    }
  }
  
  const forgetPass = async (req, res) => {
    // const userDet = await Userservices.findUsermail(req.body.email);
    // console.log("user1", userDet);
    user = await Registration.findOne({ email : req.body.email });
    console.log(user);
    if (user) {
    let user1 = await Userservices.generateOtpForForgetPass(req.body.email);
    // console.log("user2", user1);
    let resobj1 = {
      user_id : user._id,
    }
    console.log("user3", resobj1);
    if (user1.otp) {
        return sendResponse(res, 200, { status: true, data: resobj1, message: 'Otp send to your email id ' });
       }
       return sendResponse(res, 200, { status: false, message: 'Forget Password OTP not sent.' });
  }else{
    return sendResponse(res, 200, { status: false, message: ' User does not exist.' });
  }
  };

  const passwordChange = async (req, res) => {
      let user1 = await Userservices.changePassword(req.body.id, req.body.password);
      // console.log(user1);
      if (user1) 
      {
        return sendResponse(res, 200, { status: true, message: "Password changed successfully." });
      }
      return sendResponse(res, 200, { status: false, message: "Password update failed." });
  };


  const loginUser = async (req, res) => {
    const user = await Registration.findOne({email:req.body.email});
    // console.log(user)
    if (user) 
    {
      let status = user.email_verify_status;
      if (status === 'true') 
      {
        let verified = compareSync(req.body.password, user.password);
        if (verified) 
        {
          // let userDetail= await Registration.findOne({email:req.body.email});
          // console.log(userDetail);
          const user_otp = await Userservices.loginOTP(req.body.email);
          let resobj1 = {
            user_id : user_otp._id,
          }
          if (user_otp) 
          {
          return sendResponse(res, 200, { status: true, data: resobj1, message: 'Login OTP sent successfully.' });
          }
          else
          {
          return sendResponse(res, 200, { status: false, message: 'Login OTP not sent.' });
          }
        }
        else 
        {
        return sendResponse(res, 200, { status: false, message: "Passwords doesn't match." });
        }
      }
      else 
      {
      return sendResponse(res, 200, { status: false, message: 'Email verification not done.' });
      }
    }
    return sendResponse(res, 200, { status: false, message: 'The user does not exist.' });
}

module.exports = {
    registerUser,
    checkOTP,
    resendEmailOTP,
    upload,
    kycUpdate,
    forgetPass,
    passwordChange,
    loginUser
  };  