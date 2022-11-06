//const Hospital = require('../../database/sql/sequelize/models/hospital/hospital.model')
const db = require('../../database/sql/sequelize/database.connector.sequelize')
const { sendOtp, verifyOtp } = require('../../utils/otp.config')

const Hospital = db.hospitals;

// hospital register
// @route POST => /api/hospitals/register
const register = async (req, res) => {

    try {
        const { hospitalname: HospitalName, phonenumber: PhoneNumber, email: Email, city: City } = req.body;

        const isPhoneExist = await Hospital.findOne({ where: { PhoneNumber: PhoneNumber } });

        //return if phonenumber already exists
        if (isPhoneExist) return res.status(409).json({ message: "phone number already exists" })

        const isEmailExist = await Hospital.findOne({ where: { Email: Email } });

        //return if email already exists
        if (isEmailExist) return res.status(409).json({ message: "email already exists" })

        //random id for hospitalID (later will use uuid for generating HospitalID )
        const randomID = 1234
        
        const hospital = {
            HospitalID: randomID,
            HospitalName: HospitalName,
            PhoneNumber: PhoneNumber,
            Email: Email,
            City: City
        }

        //store hospital data in session (now using session to store the register data while verifing the otp)
        req.session.hospitalData = hospital

        //twilio otp send
        const sendOtpRes = await sendOtp(PhoneNumber);

        return res.status(200).json({ message: " OTP sent successfully, Enter the OTP to continue" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}

//otp verify for register 
// @route POST => /api/hospitals/checkotp
const verifyEnteredOtp = async (req, res) => {

    try {
        const { otp } = req.body;

        //check if hospital data still exist in session
        if (!req.session.hospitalData) return res.status(401).json({ verified: false, message: "something went wrong, try again" })

        const { PhoneNumber } = req.session.hospitalData

        // twilio otp verify
        const verifyOtpRes = await verifyOtp(otp, PhoneNumber)

        //return if not verified
        if (!verifyOtpRes) return res.status(400).json({ verified: false, message: "OTP verification failed " })

        //otp verify success
        if (verifyOtpRes.status == 'approved' && verifyOtpRes.valid == true) {

            //register hospital
            const hospital = await Hospital.create(req.session.hospitalData);

            res.json({ status: 201, verified: true, message: " Hospital has been registered successfully" })

        } else {
            //return if otp verify failed
            return res.status(400).json({ verified: false, message: "OTP verification failed " })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}



//login with mobile number
// @route POST => /api/hospitals/login
const mobileNumberLogin = async (req, res) => {

    try {

        const { phonenumber: PhoneNumber } = req.body;
        
        const isPhoneExist = await Hospital.findOne({ where: { PhoneNumber: PhoneNumber } });

        //return if phonenumber not found
        if (!isPhoneExist) return res.status(404).json({ message: "not registered redirect to register page" })

        // req.session.hospitalDetails = isPhoneExist
        req.session.enteredNumber = PhoneNumber

        //twilio otp  send
        const sendOtpRes = await sendOtp(PhoneNumber);

        res.status(200).json({ message: "OTP sent successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}



//otp verify  for login
// @route POST => /api/hospitals/checkotp
const checkEnteredOtp = async (req, res) => {

    try {

        const { otp } = req.body;
        const PhoneNumber = req.session.enteredNumber

        //twilio otp verify
        const verifyOtpRes = await verifyOtp(otp, PhoneNumber)

        //return if not verified
        if (!verifyOtpRes) return res.status(400).json({ verified: false, message: "OTP verification failed " })

        if (verifyOtpRes.status == 'approved' && verifyOtpRes.valid == true) {

            const hospitalData = await Hospital.findOne({ where: { PhoneNumber: PhoneNumber } });
            return res.status(200).json({ message: "OTP verification success", verified: true, hospitalData: hospitalData })

        } else {
            return res.status(400).json({ verified: false, message: "OTP verification failed " })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}


//resend otp
//@route get => /api/hospitals/resendotp
const resendOTP = async (req, res) => {
    try {

        const PhoneNumber = req.session.enteredNumber
       
        //twillio otp  sent 
        await sendOtp(PhoneNumber);

        return res.json({ status: 200, message: "OTP resend successfully" })

    } catch (error) {
        console.log(error);
        return res.json({ status: 400, message: "internal server error" })
    }
}

//testing server
const test = async (req, res) => {

    console.log("test ok");
    res.send("success");
}

// homepage
// @route get => /api/hospitals/home

module.exports = { register, mobileNumberLogin, checkEnteredOtp, test, verifyEnteredOtp, resendOTP };