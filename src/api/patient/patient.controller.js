const db = require('../../database/sql/sequelize/database.connector.sequelize')
const { patientRegisterValidator } = require("./patient.validator")

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





module.exports = {
    addPatient, getByPatientId, updateByPatientId, deleteByPatientId, searchPatient
}