//const Hospital = require('../../database/sql/sequelize/models/hospital/hospital.model')
const db = require('../../database/sql/sequelize/database.connector.sequelize')
const { sendOtp, verifyOtp } = require('../../utils/otp.config')
const { hospitalRegisterValidator, otpValidator, loginValidator } = require('./hospital.validator')


const { bpExtraction, ecgExtraction, bgExtraction, bodyTempExtraction, bloodOxygenExtraction } = require('../helpers/y')

const {hexExtraction} = require ('../helpers/hex.data.extraction')



const Hospital = db.hospitals;


// generete hospital ID
const generateID = (async () => {
    var SenseHospitalID = Math.floor(Math.random() * 90000) + 10000;
    let SenseHospitalIDStr = SenseHospitalID + ""

    // check if generated ID is unique
    const isIDExist = await Hospital.findOne({ where: { SenseHospitalID: SenseHospitalIDStr } });

    if (isIDExist) {
        generateID();
    }

    return SenseHospitalIDStr;
})





// hospital register
// @route POST => /api/hospitals/
const register = async (req, res) => {

    try {

        console.log(req.body);
        console.log(req.file);
        return

        //validate the hospital register data
        const registerValidator = await hospitalRegisterValidator(req.body);

        //return if error occured
        if (registerValidator.error) {
            return res.status(200).json({
                registered: false,
                error: true,
                message: registerValidator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const {
            hospitalname: HospitalName,
            mobilenumber: MobileNumber,
            hospitaltype: HospitalType,
            governmentundertaking: GovernmentUndertaking,
            state: State,
            city: City,
            address: Address,
            pin: Pin,
            otp: OTP

        } = req.body;

        const Email = req.body.email ? req.body.email : null;
        const Website = req.body.website ? req.body.website : null;
        
        // check mobile number
        const isMobileExist = await Hospital.findOne({ where: { MobileNumber: MobileNumber } });

        if (isMobileExist) return res.status(200).json({registered: false, error: true, message: "Mobile Number Exists"})

        // for generating ID
        const ID = await generateID();

        const registerData = {
            SenseHospitalID: ID,
            HospitalName,
            MobileNumber,
            Email,
            HospitalType,
            GovernmentUndertaking,
            State,
            City,
            Address,
            Pin,
            Website
        }


        //create hospital
        const hospital = await Hospital.create(registerData);
     
        return res.status(200).json({ registered: true, error: false, message: "Registered Successfully" });


    } catch (error) {

        console.log(error);
        return res.status(500).json({ registered: false, error: true, message: "server error" })
    }
}


//otp verify for register 
// @route POST => /api/hospitals/checkotp
const verifyEnteredOtp = async (req, res) => {

    try {

        //validation
        const validator = await otpValidator(req.body)

        //return if error occured
        if (validator.error) {
            return res.status(200).json({
                verified: false,
                error: true,
                message: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const { otp: OTP, mobilenumber: MobileNumber } = req.body;


        // twilio otp verify
        const verifyOtpRes = await verifyOtp(OTP, MobileNumber)

        //return if not verified
        if (!verifyOtpRes) return res.status(200).json({ verified: false, error: true, message: "OTP verification failed" })

        //otp verify success
        if (verifyOtpRes.status == 'approved' && verifyOtpRes.valid == true) {

            const hospitalData = await Hospital.findOne({ where: { MobileNumber: MobileNumber } });

            //after verification send hospital data if hospital is registered
            if (hospitalData) return res.status(200).json({ verified: true, isExist: true, error: false, hospitalData: hospitalData, message: "OTP verification success, Logged In" })


            res.status(200).json({ verified: true, isExist: false, error: false, message: "OTP verification success , Not registerd : re-direct to register page" })

        } else {
            // return if otp verify failed (wrong otp)
            return res.status(200).json({ verified: false, error: true, message: "OTP verification failed " })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ verified: false, error: true, message: "server error" })
    }
}



//login with mobile number
// @route POST => /api/hospitals/login
const mobileNumberLogin = async (req, res) => {

    try {

        //validate login input data
        const validator = await loginValidator(req.body)

        //return if error occured
        if (validator.error) {
            return res.status(200).json({
                otpsent: false,
                error: true,
                message: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const { mobilenumber: MobileNumber } = req.body;

        // const isMobileExist = await Hospital.findOne({ where: { MobileNumber: MobileNumber } });

        // if (!isMobileExist) {

        //     //twilio otp  send
        //     const sendOtpRes = await sendOtp(MobileNumber);

        //     return res.status(200).json({ otpsent: true, registered: false, error: false, message: "OTP sent successfully, Enter the OTP to Register" })
        // }

        //twilio otp  send
        const sendOtpRes = await sendOtp(MobileNumber);

        res.status(200).json({ otpsent: true, error: false, message: "OTP sent successfully, enter The OTP to continue" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ otpsent: false, error: true, message: "server error" })
    }
}



//otp verify  for login
// @route POST => /api/hospitals/checkotp
const checkEnteredOtp = async (req, res) => {

    try {
        console.log(req.body, "= req.body otp");
        //validate input otp
        const validator = await otpValidator(req.body)

        //return if error occured
        if (validator.error) {
            return res.status(200).json({
                verified: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const { phonenumber, otp } = req.body;

        //twilio otp verify
        const verifyOtpRes = await verifyOtp(otp, phonenumber)

        //return if not verified
        if (!verifyOtpRes) return res.status(200).json({ verified: false, message: "OTP verification failed" })

        if (verifyOtpRes.status == 'approved' && verifyOtpRes.valid == true) {

            const hospitalData = await Hospital.findOne({ where: { PhoneNumber: phonenumber } });
            return res.status(200).json({ message: "OTP verification success", verified: true, hospitalData: hospitalData })

        } else {
            return res.status(200).json({ verified: false, message: "Entered OTP is incorrect" })
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ verified: false, message: " server error" })
    }
}


//resend otp
//@route get => /api/hospitals/resendotp
const resendOTP = async (req, res) => {
    try {

        //return if entered num is not in session
        if (!req.session.enteredNumber) return res.status(400).json({ resentotp: false, message: "OTP resend failed" });

        const PhoneNumber = req.session.enteredNumber

        //twilio otp  sent 
        await sendOtp(PhoneNumber);

        return res.status(200).json({ resentotp: true, message: "OTP resent successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ resentotp: false, message: "server error" })
    }
}



//patients vital - manual entry
//@route post => /api/hospitals/manual
const registerManualEntry = async (req, res) => {
    try {
        console.log(req.body);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ resentotp: false, message: "server error" })
    }
}

//testing server
const test = async (req, res) => {


   // let data = JSON.stringify(req.body.data)
    //console.log(data);
    // console.log("================================="); 


   // console.log(data);

     //let headerData = req.body.data.slice(0, 54);
    // console.log("======");
    // console.log(headerData);
    // console.log(req.body.data.length, "===");


    let bpHeader = ["B6", "25", "0", "0", "31", "39", "31", "31", "2D", "30", "30", "2D", "31", "36", "3", "CD", "AB", "34", "12", "31", "31", "31", "31", "31", "32", "32", "32", "30", "31", "32", "33", "34", "35", "36", "37", "38", "39", "0", "3A", "17", "16", "C", "1F", "0", "64", "0", "B0", "4", "0", "0", "50", "0", "80", "0"]

    let ecgHeader = ['f6', '12', '0', '0', '31', '39', '31', '31', '2d', '30', '30', '2d', '31', '36', '3', 'cd', 'ab', '34', '12', '31', '31', '31', '31', '31', '32', '32', '32', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '0', '3a', '17', '16', 'c', '1f', '4', '64', '0', '58', '2', '0', '0', '57', '0', '0', '0']

    let bgHeader = [
        '38', '0', '0', '0', '31', '39', '31',
        '31', '2d', '30', '30', '2d', '31', '36',
        '3', 'cd', 'ab', '34', '12', '31', '31',
        '31', '31', '31', '32', '32', '32', '30',
        '31', '32', '33', '34', '35', '36', '37',
        '38', '39', '0', '3a', '17', '16', 'c',
        '1f', '1', '0', '0', '1', '0', '0',
        '0', '96', '0', '0', '0'
    ]

    let bodyTempHeader = [
        '38', '0', '0', '0', '31', '39', '31',
        '31', '2d', '30', '30', '2d', '31', '36',
        '3', 'cd', 'ab', '34', '12', '31', '31',
        '31', '31', '31', '32', '32', '32', '30',
        '31', '32', '33', '34', '35', '36', '37',
        '38', '39', '0', '3a', '17', '16', 'c',
        '1f', '7', '0', '0', '1', '0', '0',
        '0', '0', '0', 'c3', '42'
    ]

    let spo2Header =  [
        'f6', '12', '0',  '0',  '31', '39', '31',
        '31', '2d', '30', '30', '2d', '31', '36',
        '3',  'cd', 'ab', '34', '12', '31', '31',
        '31', '31', '31', '32', '32', '32', '30',
        '31', '32', '33', '34', '35', '36', '37',
        '38', '39', '0',  '3a', '17', '16', 'c',
        '1f', '6',  '64', '0',  '58', '2',  '0',
        '0',  '5f', '0',  '0',  '0'
      ]
      
    let contex = 'Body_Temp'
    const result = hexExtraction(bodyTempHeader, contex);

    console.log(result," == result");












    res.send("success");
}

// homepage
// @route get => /api/hospitals/home

module.exports = {
    register, mobileNumberLogin, checkEnteredOtp, test, verifyEnteredOtp, resendOTP,
    registerManualEntry

};