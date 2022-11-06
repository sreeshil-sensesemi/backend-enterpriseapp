const express = require("express")
const router = express.Router()

const { addDoctor } = require("./doctor.controller")

//add doctor
router.post('/adddoctor', addDoctor);


module.exports = router;
