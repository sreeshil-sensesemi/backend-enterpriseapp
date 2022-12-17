const db = require('../../database/sql/sequelize/database.connector.sequelize')
const { doctorRegisterValidator } = require("./doctor.validator")

const Doctor = db.doctors;


// add doctor
// @route POST => /api/doctors/adddoctor
const addDoctor = async (req, res) => {
    try {

        //validate the hospital register data
        const validator = await doctorRegisterValidator(req.body);

        //return if error occured
        if (validator.error) {
            return res.status(200).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }


        //now just using some randomID , will change it
        const randomID = 1234;

        const doctorData = {
            DoctorID: randomID,
            RegistrationNo: req.body.registrationno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Specialization: req.body.specialization,
            StateMedicalCouncil: req.body.statemedicalcouncil,
            PracticingSince: req.body.practicingsince,
            Age: req.body.age,
            Gender: req.body.gender,
            Mobile: req.body.mobile,
            City: req.body.city,
            State: req.body.state,
        }

        const isMobileExist = await Doctor.findOne({ where: { Mobile: req.body.mobile } });

        //return if mobile number already exists
        if (isMobileExist) return res.status(409).json({ registered: false, message: "mobile number already exists" })

        //create doctor
        const doctor = await Doctor.create(doctorData);

        res.status(201).json({ registered: true, message: "Doctor is registered successfully" });

    } catch (error) {

        console.log(error);
        return res.status(400).json({ registered: false, message: "internal server error" })
    }
}


//fetch doctor details by doctorid
// @route GET => /api/doctors/:id
const getByDoctorId = async (req, res) => {
    try {
        const doctorID = req.params.id;

        const doctorData = await Doctor.findOne({ where: { DoctorID: doctorID } });

        if (!doctorData) return res.status(409).json({ message: "doctor details not found" });

        res.status(200).json({ doctorData })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "internal server error" })
    }
}

//update doctor details 
// @route PUT => /api/doctors/:id
const updateByDoctorId = async (req, res) => {
    try {

        //validate the doctor update data
        const validator = await doctorRegisterValidator(req.body);

        //return if error occured
        if (validator.error) {
            return res.status(400).json({
                status: false,
                error: validator.error.details[0].message.replace(/"/g, ""),
            });
        }

        const doctorId = req.params.id;

        const data = {
            RegistrationNo: req.body.registrationno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Specialization: req.body.specialization,
            StateMedicalCouncil: req.body.statemedicalcouncil,
            PracticingSince: req.body.practicingsince,
            Age: req.body.age,
            Gender: req.body.gender,
            Mobile: req.body.mobile,
            City: req.body.city,
            State: req.body.state,
        }

        const updatedData = await Doctor.update(data, { where: { DoctorID: doctorId } });

        if (updatedData == 0) return res.status(409).json({ update: false, message: "update failed, doctor not found" })

        res.status(200).json({ update: true, message: "updated successfully" })

    } catch (error) {
        console.log(error);
        return res.status(500).json({ update: false, message: "internal server error" })
    }
}



//delete doctor 
// @route DELETE => /api/doctors/:id
const deleteByDoctorId = async (req, res) => {
    try {

        const doctorId = req.params.id;

        const response = await Doctor.destroy({ where: { DoctorID: doctorId } })

        if (response == 0) return res.status(409).json({ delete: false, message: "delete failed, doctor not found" });

        res.status(200).json({ delete: true, message: "deleted successfully" })

    } catch (error) {
        console.log(error);
        return res.status(400).json({ delete: false, message: "internal server error" })
    }
}



//search doctor 
// @route GET => /api/doctors/search
const searchDoctor = async (req, res) => {
    try {
        //now search is based on name of the doctor , will use other queries later 

        const doctorName = req.query.name;

        const doctorData = await Doctor.findOne({ where: { FirstName: doctorName } })

        if (!doctorData) return res.status(409).json({ message: "doctor not found" })

        res.status(200).json(doctorData);

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "internal server error" })
    }
}







module.exports = {
    addDoctor, getByDoctorId, updateByDoctorId, deleteByDoctorId, searchDoctor
}