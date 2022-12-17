const express = require("express")
const router = express.Router()
const { register, checkEnteredOtp, mobileNumberLogin, test, verifyEnteredOtp, resendOTP,
    registerManualEntry,
} = require("./hospital.controller")

const { hospitalRegisterValidator } = require("./hospital.validator")
const upload = require('../../utils/multer.config');



router.post('/', upload.single('logo'), register);

router.post('/login', mobileNumberLogin)

//verify entered otp for register
router.post('/verifyotp', verifyEnteredOtp)

//verify entered otp for login
router.post('/checkotp', checkEnteredOtp)

//resend otp
router.get('/resendotp', resendOTP)



//patients vital - manual entry
router.post('/manual', registerManualEntry);

router.post('/test', test)

module.exports = router;