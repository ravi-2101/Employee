const Joi = require('joi');
const moment = require('moment');

const customDateValidator = (value, helpers) => {
    const parsedDate = moment(value, 'DD-MM-YYYY', true);
    if (!parsedDate.isValid()) {
        return helpers.error('any.invalid');
    }
    return value;
};

const employeeJoiSchema = Joi.object({
    userName: Joi.string().required(),
  
    fullName: Joi.string().required(),
  
    password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  
    confirmPassword: Joi.ref("password"),
  
    email: Joi.string()
      .lowercase()
      .email({ minDomainSegments: 2, tlds: { allow: ["com", "net"] } }),
  
    phone: Joi.string(),
  
  
    DOB: Joi.string().custom(customDateValidator, 'custom date validation').required()
        .messages({ "any.invalid": "DOB must be in format DD-MM-YYYY" }),

    joiningDate: Joi.string().custom(customDateValidator, 'custom date validation').required()
        .messages({ "any.invalid": "joiningDate must be in format DD-MM-YYYY" }),
  
    gender: Joi.string()
        .valid('Male', 'Female', 'Other')
        .required()
        .messages({
            "any.only": "Gender must be 'male', 'female', or 'other'",
            "string.empty": "Gender is required",
        }),
    department : Joi.string()
        .valid("Node js","React js", "Mern")
        .required()
        
  }).or("email", "phone");
  
  module.exports = employeeJoiSchema;
  