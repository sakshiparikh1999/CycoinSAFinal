const express = require("express")
const router = express.Router()
const userController = require('../controllers/userController');

router.get("/", (req, res) => {
    res.render('index.ejs');
});

router.post('/signup', userController.registerUser);

router.get("/checkOTP", (req, res) => {
    res.render('otp.ejs');
});

router.post('/checkOTP', userController.checkOTP);

router.post('/resendOTP', userController.resendEmailOTP);

router.post('/kycUpdate',userController.upload,userController.kycUpdate);

router.post('/forgetpassword', userController.forgetPass);

router.post('/changePass', userController.passwordChange);

router.post('/login', userController.loginUser);

// router.post('/login', userController.loginUser);

// router.post('/checkOTP', userController.checkOTP);



module.exports = router;

// signup  - 4 digit otp - verifyotp - resend otp - complete kyc 