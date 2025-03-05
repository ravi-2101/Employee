const mongoose = require('mongoose');


const employeeSchema = new mongoose.Schema ({
    userName : {
        type : String,
        required : true,
        unique : true 
    },
    fullName : {
        type  : String,
        required : true 
    },
    email : {
        type : String,
        trim : true,
        lowercase : true,
        validate: {
            validator: function (value) {
              return !value || /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|net)$/.test(value);
            },
            message: 'Email must be a valid format and end with .com or .net',
          },
        required : true,
        unique : true 
    },
    password : {
        type : String,
        required : true 
    },
    confirmPassword : {
        type : String,
        ref : "password",
    },
    phone : {
        type : String,
        trim : true
    },
    DOB : {
        type : Date,
        required : true,
        default : Date.now()
    },
    joiningDate : {
        type : Date,
        required : true,
    },
    gender : {
        type : String,
        enum : ["Male","Female","Other"],
        required : true 
    },
    department : {
        type :  String,
        enum : ["Node js", "React js", "Mern"],
        required : true 
    }
},{timestamps : true,versionKey : false})




const Employee = mongoose.model("Employee",employeeSchema);

module.exports = Employee;