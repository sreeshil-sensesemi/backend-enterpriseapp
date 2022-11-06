const express = require('express')
const router = express.Router();
const { addPatient } = require('./patient.controller')

//add patient
router.post('/addpatient', addPatient)


module.exports = router;