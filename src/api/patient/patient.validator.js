const Joi = require("joi");


//patient register validation schema
const patientRegisterValidator = (data) => {

    const registerSchema = Joi.object({
        patientid: Joi.number().required().label("PatientID"),
        firstname: Joi.string().required().label("First Name"),
        lastname: Joi.string().required().label("Last Name"),
        age: Joi.number().required().label("Age"),
        mobile: Joi.string().required().length(10).label("Mobile Number"),
        city: Joi.string().required().label("City"),
        state: Joi.string().required().label("State"),
        SBP: Joi.number().required().label("SBP"),
        DBP: Joi.number().required().label("DBP"),
        height: Joi.number().required().label("Height"),
        weight: Joi.number().required().label("Weight"),
        gender: Joi.string().required().label("Gender"),
    })

    return registerSchema.validate(data);
}




module.exports = {
    patientRegisterValidator,
}