const express = require('express');
const { loginValidator } = require('../hospital/hospital.validator');
const router = express.Router();
const { addPatient, getByPatientId, updateByPatientId, deleteByPatientId, searchPatient, loginWithMobile,
    checkEnteredOtp,

} = require('./patient.controller')

//add patient
router.post('/', addPatient)


//search patient
router.get('/search', searchPatient)

//fetch patient details by patientid
router.get('/:id', getByPatientId);

//update patient details
router.put('/:id', updateByPatientId) 

//delete patient
router.delete('/:id', deleteByPatientId)



//login with mobile
router.post('/login' , loginWithMobile);

//verify login OTP
router.post('/verify-otp', checkEnteredOtp);








module.exports = router;