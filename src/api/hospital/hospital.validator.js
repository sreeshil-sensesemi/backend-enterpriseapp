const Joi = require('joi');


//register hopital validation schema
const hospitalRegisterValidator = (data) => {

    const registerSchema = Joi.object({
        hospitalname: Joi.string().required().min(4).label("Hospital Name"),
        phonenumber: Joi.string().required().length(10).label("Phone Number"),
        email: Joi.string().email().required().label("Email"),
        city: Joi.string().required().min(4).label("City")
    })
    //.options({ abortEarly: false });

    return registerSchema.validate(data);
}

//otp validation schema
const otpValidator = (data) => {

    const otpSchema = Joi.object({
        otp: Joi.string().required().length(4).label("OTP")
    });

    return otpSchema.validate(data);
}

//login input validation schema
const loginValidator = (data) => {

    const loginSchema = Joi.object({
        phonenumber: Joi.string().required().length(10).label("Phone Number")
    });

    return loginSchema.validate(data);
}


module.exports = {
    hospitalRegisterValidator,
    otpValidator,
    loginValidator,
}