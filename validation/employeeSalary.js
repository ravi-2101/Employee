const Joi = require('joi');
JoiObjectId = require('joi-objectid')(Joi);

const salaryJoiSchema = Joi.object({
    employeeId: JoiObjectId().required(),
  
    payDate : Joi.date().required(),
    
    department : Joi.string()
        .valid("Node js","React js", "Mern")
        .required(),

    salary : Joi.number().required()
        
  });
  
  module.exports = salaryJoiSchema;
  