const Joi = require('joi');


//register hopital validation schema
const hospitalRegisterValidator = (data) => {

    const registerSchema = Joi.object({
        hospitalname: Joi.string().required().label("Hospital Name"),
        mobilenumber: Joi.string().required().length(10).label("Phone Number"),
        email: Joi.string().email().label("Email"),
        hospitaltype: Joi.string().required().label("Hospital Type"),
        governmentundertaking: Joi.string().required().label("Government Undertaking"),
        state: Joi.string().required().label("State"),
        city: Joi.string().required().label("City"),
        address: Joi.string().required().label("Address"),
        pin: Joi.number().required().label("State"),
        website: Joi.string().label("Website"),
       // logo: Joi.string().required().label("Logo"),


    })
   // .options({ abortEarly: false });

    return registerSchema.validate(data);
}

//otp validation schema
const otpValidator = (data) => {

    const otpSchema = Joi.object({
        otp: Joi.string().required().length(4).label("OTP"),
        //phonenumber: Joi.string().required().length(10).label("Phone Number"),
    });

    return otpSchema.validate(data);
}

//login input validation schema
const loginValidator = (data) => {

    const loginSchema = Joi.object({
        mobilenumber: Joi.string().required().length(10).label("Mobile Number")
    });

    return loginSchema.validate(data);
}


module.exports = {
    hospitalRegisterValidator,
    otpValidator,
    loginValidator,
}