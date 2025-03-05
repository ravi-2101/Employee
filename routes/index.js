const  router = require('express').Router();
const employee = require('./employee.routes')

router.use('/employee',employee);

module.exports = router;