const router = require('express').Router();
const { employeeRegistration, employeeSalaryData, sortAllEmployeeSalaryData, allEmployeeData, sortOneEmployeeSalaryData, getAllEMployeeTotal, getOneEMployeeTotal } = require('../controller/employee.controller');
const employeeJoiSchema = require('../validation/employeeData');
const validate = require('../validation/validate')
const salaryJoiSchema = require('../validation/employeeSalary');


router.post('/register',validate(employeeJoiSchema),employeeRegistration)
router.post('/salary',validate(salaryJoiSchema),employeeSalaryData)
router.get('/sort',sortAllEmployeeSalaryData)
router.get('/sorted/:id',sortOneEmployeeSalaryData)
router.get('/get',allEmployeeData)
router.get('/sortaggre',getAllEMployeeTotal)
router.get('/sortaggre/:userName',getOneEMployeeTotal)

module.exports = router;