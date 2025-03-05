const mongoose = require('mongoose');

const employeeSalarySchema = new mongoose.Schema({
    employeeId : {
        type : mongoose.Types.ObjectId,
        ref : "Employee",
        required : true 
    },
    department : {
        type : String,
        required : true,
        enum : ["React js","Node js","Mern"]
    },
    payDate : {
        type : Date,
        required : true 
    },
    salary : {
        type : Number ,
        required : true,
        default : 0 
    },
},{timestamps : true,versionKey : false});





const EmployeeSalary = mongoose.model("EmployeeSalary",employeeSalarySchema);

module.exports= EmployeeSalary;