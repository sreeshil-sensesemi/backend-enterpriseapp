const db = require('../../database/sql/sequelize/database.connector.sequelize')

const Patient = db.patients;

const addPatient = async (req, res) => {
    try {

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
        if (isMobileExist) return res.status(409).json({ message: "mobile number already exists" })

        //create patient
        const patient = await Patient.create(patientData);

        res.status(201).json({ message: "Patient is registered successfully" });

    } catch (error) {
        console.log(error);
        return res.json({ status: 400, message: "internal server error" })
    }
}



module.exports = {
    addPatient
}