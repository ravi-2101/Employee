const express = require('express');
const app = express();
require('dotenv').config();
const databaseConnection = require('./config/mondoDBConnect');
const employee = require('./routes/index')

const port = process.env.PORT;


app.use(express.json());
app.use('/api',employee);

app.listen(port,()=>{
    console.log("server connected : ",port);
})

databaseConnection();