const db = require('../../database/sql/sequelize/database.connector.sequelize')

const Doctor = db.doctors;


// add doctor
// @route POST => /api/doctors/adddoctor
const addDoctor = async (req, res) => {
    try {
        const randomID = 1234;

        const doctorData = {
            DoctorID: randomID,
            RegistrationNo: req.body.registrationno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Specialization: req.body.specialization,
            StateMedicalCouncil: req.body.statemedicalcouncil,
            PractisingSince: req.body.practisingsince,
            Age: req.body.age,
            Gender: req.body.gender,
            Mobile: req.body.mobile,
            City: req.body.city,
            State: req.body.state,
        }

        const isMobileExist = await Doctor.findOne({ where: { Mobile: req.body.mobile } });

        //return if mobile number already exists
        if (isMobileExist) return res.status(409).json({ message: "mobile number already exists" })

        //create doctor
        const doctor = await Doctor.create(doctorData);

        res.status(201).json({ message: "Doctor is registered successfully" });

    } catch (error) {

        console.log(error);
        return res.json({ status: 400, message: "internal server error" })
    }
}


module.exports = {
    addDoctor
}