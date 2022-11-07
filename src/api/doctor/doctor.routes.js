const express = require("express")
const router = express.Router()

const { addDoctor, getByDoctorId, updateByDoctorId, deleteByDoctorId, searchDoctor} = require("./doctor.controller")

//add doctor
router.post('/', addDoctor);


//search doctor
router.get('/search', searchDoctor)

//fetch doctor details by doctorid
router.get('/:id', getByDoctorId);

//update doctor details
router.put('/:id', updateByDoctorId)

//delete doctor
router.delete('/:id', deleteByDoctorId)



module.exports = router;
