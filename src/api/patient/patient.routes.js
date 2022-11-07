const express = require('express')
const router = express.Router();
const { addPatient, getByPatientId, updateByPatientId, deleteByPatientId, searchPatient } = require('./patient.controller')

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





module.exports = router;