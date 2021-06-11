const { hashSync } = require('bcryptjs');
const moment = require('moment');
const otpGenerator = require('otp-generator');
var lookup = require('country-data').lookup;
const { Registration  } = require('../models/userModel');
const mailer = require('../helper/mailer');

// const Stellar = require('stellar-sdk')
// const rp = require('request-promise')
var request = require('request');
var ObjectId = require('mongoose').Types.ObjectId;
// const { transactions, CreateWallet } = require('../models/walletModel');


const addUser = async userDetails => {
    let otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    // var details_name = lookup.countries({countryCallingCodes: userDetails.countryCode})
//     var pair = Stellar.Keypair.random();
//     const walletObject = {
//       publicKey: pair.publicKey(),
//       secretKey: pair.secret(),
//     };

//     // Create Account and request balance on testnet
//   await rp.get({
//     uri: 'https://horizon-testnet.Stellar.org/friendbot',
//     qs: { addr: pair.publicKey() },
//     json: true
//   })

    const userObject = {
        name: userDetails.name,
        email: userDetails.email,
        mobile_no: userDetails.mobile_no,
        password: hashSync(userDetails.password, 10),
        otp: otp,
        country_code: userDetails.countrycode,
    };

    try {
        //checking for email already exist..
         let objEmail=await Registration.findOne({email:userDetails.email});
         if(objEmail){
             return false;
         }else{
            const user = new Registration(userObject);
            await user.save();
            let resEmail=await Registration.findOne({email:userDetails.email});
            let resobj = {
                user_id : resEmail._id,
                user_name : resEmail.name,
                user_otp : resEmail.otp,
                user_mobile : resEmail.mobile_no,
                user_country : resEmail.country_code
            }
            // console.log(user);
            let subject = 'OTP for Email Verification';
            let content = 'The OTP for your Email Verification is ' + user.otp + '.<br> Please enter this OTP for completing your verification process.'
            try {
                await mailer.run_mail(userDetails.email, subject, content);
                return resobj;
            } catch (error) {
                console.log(error);
                throw new Error(`Unable to register user due to ${error}`);
            }
         }
     
    } catch (err) {
        console.log(err.message);
        throw new Error(`Unable to register user due to ${err.message}`);
    }
};

const findUser = id => Registration.findOne({  _id: id  });

const updateVerificationStatus = async id => {
    try{
    let fuser = await Registration.findOne({ _id: id });
    // console.log("fuser", fuser)
    await Registration.updateOne(
        { _id : fuser.id },
        {
            $set: {
                email_verify_status: 'true',
                login_status: 'true'
            }
        }
    );
    // console.log("secon", fuser)
    let user = await Registration.findOne({ _id : fuser.id });
    // console.log("third", user);
    return user;
    }catch(err){
        throw err;
    }
}


const newVerificationOTP = async id => {
    let otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    let user = await Registration.findOne({ _id: id });
    console.log(user.id)
    if (user) {
        try {
            await Registration.updateOne(
                { _id : user.id },
                {
                    $set: {
                        otp: otp
                    }
                }
            );
            let subject = 'New OTP for Verification';
            let content = 'The OTP for your Verification is ' + otp + '.<br> Please enter this OTP for completing your verification process.'
            try {
                await mailer.run_mail(user.email, subject, content);
                return otp;
            } catch (error) {
                console.log(err.message);
                throw new Error(`Unable to send mail due to ${err.message}`);
            }
        } catch (error) {
        }
    }
}

const checkOTP = async (id, otp) => {
    let user = await Registration.findOne({ _id: id });
    if (user) {
        if (user.otp === otp) {
            return true;
        }
    }
}

// const updatekey = async function() {
//     try {
//         let public_key = await CreateWallet.findOne();
//         console.log("publickey", public_key.publickey);
//     } catch (error) {
//         console.log(error);
//     }
// }

const kycDataUpdate=async function(filename,data){
    let fileObj={file:filename};
    console.log("fileobject", fileObj);
    console.log("data", data);
        // let docType=data.doctype;
        // let fileName=fileObj.file;
        // let docIdNumber=data.docIdNum;
    try{
        let isUpdated=await Registration.updateOne({_id:data.id},{$set:{'kycUpdate.docType':data.docType,'kycUpdate.fileName':fileObj.file,'kycUpdate.docIdNumber':data.docIdNumber, 'kycUpdate.expirydate': data.expirydate ,'kycUpdate.docVerified': 'Waiting'}});
        console.log("isUpdated", isUpdated);
        return isUpdated;
    }catch(err){
        throw err;
    }
}

// forgetassword



const generateOtpForForgetPass=async email=>{
    let otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    try {
        await Registration.updateOne(
            { email },
            {
                $set: {
                    otp: otp
                }
            }
        );
        let subject = 'OTP for Forget password';
        let content = 'The OTP for your Verification is  ' + otp + '.<br> Please enter this OTP for set new password'
        try {
            await mailer.run_mail(email, subject, content);
            let user = await Registration.findOne({ email });
            return user;
        } catch (error) {
            console.log(err.message);
            throw new Error(`Unable to register user due to ${err.message}`);
        }
    } catch (error) {
    }
}

const changePassword = async (id, password) => {
    await Registration.updateOne(
        { _id : id },
        {
            $set: {
                password: hashSync(password, 10)
            }
        }
    );
    let user = await Registration.findOne({  _id : id });
    return user;
}


const loginOTP = async email => {
    let otp = otpGenerator.generate(4, { alphabets: false, upperCase: false, specialChars: false });
    try 
    {
        await Registration.updateOne(
        { email },
        {
        $set: {
        otp: otp
        }
        }
        );
        let subject = 'OTP for Login';
        let content = 'The OTP for your Email Login is ' + otp + '.<br> Please enter this OTP for completing your login process.'
        try 
        {
            await mailer.run_mail(email, subject, content);
            let user = await Registration.findOne({ email });
            return user;
        } 
        catch (error) 
        {
            console.log(err.message);
            throw new Error(`Unable to register user due to ${err.message}`);
        }
    } 
    catch (error) {

    }
    }

module.exports = {
    addUser,
    findUser,
    updateVerificationStatus,
    newVerificationOTP,
    checkOTP,
    kycDataUpdate,
    generateOtpForForgetPass,
    changePassword,
    loginOTP
};