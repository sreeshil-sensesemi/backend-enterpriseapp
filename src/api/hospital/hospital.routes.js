const express = require("express")
const router = express.Router()
const {register, checkEnteredOtp, mobileNumberLogin ,test, verifyEnteredOtp, resendOTP} = require("./hospital.controller")

const {hospitalRegisterValidator} = require("./hospital.validator")

router.post('/register', register)
router.post('/login', mobileNumberLogin)

//verify entered otp for register
router.post('/verifyotp', verifyEnteredOtp)

//verify entered otp for login
router.post('/checkotp', checkEnteredOtp)

//resend otp
router.get('/resendotp', resendOTP)

//home
//router.get('/home', home)

router.get('/test', test)

module.exports = router;