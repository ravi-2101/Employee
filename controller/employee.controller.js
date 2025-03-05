const Employee = require("../model/employee.model");
const bcrypt = require("bcrypt");
const moment = require("moment");
const EmployeeSalary = require("../model/employeeSalary.model");
const mongoose = require("mongoose");

const employeeRegistration = async (req, res) => {
  try {
    // get data
    const {
      userName,
      fullName,
      email,
      password,
      confirmPassword,
      phone,
      joiningDate,
      gender,
      department,
      DOB,
    } = req.body;

    // check employee already present
    const findEmployee = await Employee.findOne({ userName }).select(
      "userName"
    );
    if (findEmployee) {
      return res
        .status(400)
        .json({ status: false, message: "Employee already exists!" });
    }

    // hash and compare password
    const hashpassword = await bcrypt.hash(password, 10);
    const comparePassword = await bcrypt.compare(confirmPassword, hashpassword);

    if (!comparePassword) {
      return res
        .status(400)
        .json({ status: false, message: "Password must be same!" });
    }

    // date fields change with moment js
    const joiningdate = await moment(joiningDate, "DD-MM-YYYY");
    const dob = await moment(DOB, "DD-MM-YYYY");

    // create employee
    const employee = await Employee.create({
      userName,
      fullName,
      email,
      phone,
      gender,
      department,
      password: hashpassword,
      DOB: dob,
      joiningDate: joiningdate,
    });

    // response
    return res.status(201).json({
      status: true,
      data: employee,
      message: "Employee created successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const employeeSalaryData = async (req, res) => {
  try {
    // get data
    const { employeeId, department, payDate, salary } = req.body;

    const paydate = await moment(payDate, "DD-MM-YYYY");

    // create employee salary data
    const employeeSalary = await EmployeeSalary.create({
      employeeId,
      department,
      salary,
      payDate: paydate,
    });

    // response
    return res.status(201).json({
      status: true,
      data: employeeSalary,
      message: "Salary credited to your account!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const allEmployeeData = async (req, res) => {
  try {
    const employee = await EmployeeSalary.find();

    return res.status(200).json({
      status: true,
      data: employee,
      message: "Employee data fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// with moment js
const sortAllEmployeeSalaryData = async (req, res) => {
  try {
    // get data
    const { startDate, endDate } = req.body;

    const startdate = moment(startDate);
    const enddate = moment(endDate);

    const employee = await EmployeeSalary.find();

    // filter employees
    const filterEmployees = employee.filter((employee) => {
      const payDate = moment(employee?.payDate);
      const employeedata = [];
      if (payDate.isBetween(startdate, enddate)) {
        employeedata.push(employee);
        return employeedata;
      }
      return null;
      //   return payDate.isBetween(startdate, enddate, null, "[]");
    });

    // Calculate total salary
    const totalSalary = filterEmployees.reduce(
      (sum, employee) => sum + employee.salary,
      0
    );

    // response
    return res.status(200).json({
      status: true,
      data: { employees: filterEmployees, totalSalary },
      message: "Employee data sorted with applied date successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const sortOneEmployeeSalaryData = async (req, res) => {
  try {
    // get data
    const { startDate, endDate } = req.body;
    const { id } = req.params;

    const startdate = moment(startDate);
    const enddate = moment(endDate);

    // find employee
    const employee = await EmployeeSalary.find({
      employeeId: new mongoose.Types.ObjectId(id),
      payDate : {
        $gt : startdate,
        $lt : enddate
      }
    });
    

   
    // calculate total salary
    const totalSalary = employee.reduce(
      (sum, data) => sum + data?.salary,
      0
    );

    // response
    return res.status(200).json({
      status: true,
      data: { employee: employee, totalSalary },
      message: "Employee data sorted with applied date successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

// with aggregation
const getOneEMployeeTotal = async (req, res) => {
  try {
    // get data
    const { startDate, endDate } = req.body;
    const { userName } = req.params;
    const startdate = moment(startDate)._d;
    const enddate = moment(endDate)._d;
    console.log(startdate)
    // aggregation
    const employee = await EmployeeSalary.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employees",
          pipeline: [
            {
              $project: {
                userName: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: "$employees",
      },
      {
        $project: {
          employeeName: "$employees.userName",
          department: 1,
          payDate: 1,
          salary: 1,
          createdAt: 1,
        },
      },
      {
        $match: {
          payDate: {
            $gte: startdate,
            $lte: enddate,
          },
          employeeName: userName,
        },
      },
      {
        $facet: {
          employeeData: [],
          employeeName: [
            {
              $group: {
                _id: "$employeeName",
                totalsalary: {
                  $sum: "$salary",
                },
              },
            },
          ],
        },
      },
    ]);

    // response
    return res.status(200).json({
      status: true,
      data: employee,
      message: "Employee data fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getAllEMployeeTotal = async (req, res) => {
  try {
    // get data
    const { startDate, endDate } = req.body;
    const startdate = moment(startDate)._d;
    const enddate = moment(endDate)._d;

    // aggregation
    const employee = await EmployeeSalary.aggregate([
      {
        $lookup: {
          from: "employees",
          localField: "employeeId",
          foreignField: "_id",
          as: "employees",
          pipeline: [
            {
              $project: {
                userName: 1,
                _id: 0,
              },
            },
          ],
        },
      },
      {
        $unwind: "$employees",
      },
      {
        $project: {
          employeeName: "$employees.userName",
          department: 1,
          payDate: 1,
          salary: 1,
          createdAt: 1,
        },
      },
      {
        $match: {
          payDate: {
            $gte: startdate,
            $lte: enddate,
          },
        },
      },
      {
        $facet: {
          employeeData: [],
          employeeName: [
            {
              $group: {
                _id: "$employeeName",
                totalsalary: {
                  $sum: "$salary",
                },
              },
            },
          ],
        },
      },
    ]);

    // response
    return res.status(200).json({
      status: true,
      data: employee,
      message: "Employee data fetched successfully!",
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  employeeRegistration,
  employeeSalaryData,
  sortAllEmployeeSalaryData,
  sortOneEmployeeSalaryData,
  allEmployeeData,
  getOneEMployeeTotal,
  getAllEMployeeTotal,
};
