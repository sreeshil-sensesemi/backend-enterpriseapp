const db = require('../../database/sql/sequelize/database.connector.sequelize');
const { patientRegisterValidator } = require("./patient.validator");
const {loginValidator ,otpValidator} = require('../hospital/hospital.validator');
const {sendOtp, verifyOtp, } = require('../../utils/otp.config');


const Patient = db.patients;

// add patient
// @route POST => /api/patients/addpatient
const addPatient = async (req, res) => {
    try {

        //validate the patient register data
        const validator = await patientRegisterValidator(req.body);

        //return if error occured
        if (validator.error) {
            return res.status(400).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const patientData = {
            PatientID: req.body.patientid,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Age: req.body.age,
            Gender: req.body.gender,
            Mobile: req.body.mobile,
            City: req.body.city,
            State: req.body.state,
            SBP: req.body.SBP,
            DBP: req.body.DBP,
            Height: req.body.height,
            Weight: req.body.weight,
        }

        const isMobileExist = await Patient.findOne({ where: { Mobile: req.body.mobile } });

        //return if mobile number already exists
        if (isMobileExist) return res.status(409).json({ registered: false, message: "mobile number already exists" })

        //create patient
        const patient = await Patient.create(patientData);

        res.status(201).json({ registered: true, message: "Patient is registered successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ registered: false, message: "internal server error" })
    }
}




//fetch patient details by patientid
// @route GET => /api/patients/:id
const getByPatientId = async (req, res) => {
    try {
        const patientID = req.params.id;

        const patientData = await Patient.findOne({ where: { PatientID: patientID } });

        if (!patientData) return res.status(409).json({ message: "patient details not found" });

        res.status(200).json({ patientData })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}

//update patient details 
// @route PUT => /api/patients/:id
const updateByPatientId = async (req, res) => {
    try {

        //validate the patient  update data
        const validator = await patientRegisterValidator(req.body);

        //return if error occured
        if (validator.error) {
            return res.status(400).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const patientId = req.params.id;

        const data = {
            PatientID: req.body.patientid,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Age: req.body.age,
            Gender: req.body.gender,
            Mobile: req.body.mobile,
            City: req.body.city,
            State: req.body.state,
            SBP: req.body.SBP,
            DBP: req.body.DBP,
            Height: req.body.height,
            Weight: req.body.weight,
        }

        const updatedData = await Patient.update(data, { where: { PatientID: patientId } });

        if (updatedData == 0) return res.status(409).json({ update: false, message: "update failed, patient not found" })

        res.status(200).json({ update: true, message: "updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ update: false, message: "internal server error" })
    }
}




//delete patient
// @route DELETE => /api/patients/:id
const deleteByPatientId = async (req, res) => {
    try {


        const patientId = req.params.id;

        const response = await Patient.destroy({ where: { PatientID: patientId } })

        if (response == 0) return res.status(409).json({ delete: false, message: "patient not found" });

        res.status(200).json({ delete: true, message: "deleted successfully" })


    } catch (error) {
        console.log(error);
        return res.status(500).json({ delete: false, message: "internal server error" })
    }
}


//search patient
// @route GET => /api/patients/search
const searchPatient = async (req, res) => {
    try {
        //now search is only based on name of the patient , will use other queries later 

        const patientName = req.query.name;

        const patientData = await Patient.findOne({ where: { FirstName: patientName } })

        if (!patientData) return res.status(409).json({ message: "patient not found" })

        res.status(200).json(patientData);

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}



//login of patient with mobile number
// @route POST => /api/patients/login
const loginWithMobile = async (req, res) => {
    try {

        //validate the patient login
        const validator = await loginValidator(req.body);

        //return if error occured
        if (validator.error) {
            return res.status(400).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        
        const { phonenumber: PhoneNumber } = req.body;

        const isUserExist = await Patient.findOne({ where: { PhoneNumber: PhoneNumber } });

        //return if phonenumber not found
        if (!isUserExist) return res.status(404).json({ otpsent: false, registered: false, message: "Not registered" })

        // req.session.hospitalDetails = isPhoneExist
        req.session.enteredPatientNumber = PhoneNumber

        //twilio otp  send
        const sendOtpRes = await sendOtp(PhoneNumber);

        res.status(200).json({ otpsent: true,registered: true, message: "OTP sent successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}



//otp verify  for login
// @route POST => /api/patients/verify-otp
const checkEnteredOtp = async (req, res) => {

    try {
        
        //validate input otp
        const validator = await otpValidator(req.body)

        //return if error occured
        if (validator.error) {
            return res.status(400).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const { otp } = req.body;
        const PhoneNumber = req.session.enteredPatientNumber

        //twilio otp verify
        const verifyOtpRes = await verifyOtp(otp, PhoneNumber)

        //return if not verified
        if (!verifyOtpRes) return res.status(401).json({ verified: false, message: "OTP verification failed" })

        if (verifyOtpRes.status == 'approved' && verifyOtpRes.valid == true) {

            const PatientData = await Patient.findOne({ where: { PhoneNumber: PhoneNumber } });
            return res.status(200).json({ verified: true, patientData: PatientData, message: "OTP verification success",  })

        } else {
            return res.status(409).json({ verified: false, message: "OTP verification failed " })
        }

    } catch (error) {
        console.log(error);
        return res.status(400).json({ verified: false, message: "internal server error" })
    }
}






module.exports = {
    addPatient, getByPatientId, updateByPatientId, deleteByPatientId, searchPatient,
    loginWithMobile, checkEnteredOtp
}