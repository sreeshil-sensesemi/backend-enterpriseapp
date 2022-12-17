const express = require('express');
const session = require('express-session');


//import routes
const hopitalRoutes = require('./api/hospital/hospital.routes');
const doctorRoutes = require('./api/doctor/doctor.routes');
const patientRoutes = require('./api/patient/patient.routes');


//app
const app = express();

//middlewares
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({extended:true,limit: '50mb'}));
app.use(session({cookie: {  path: '/', maxAge: 60000000}, secret: process.env.SECRET_KEY_SESSION}));


//routes middlewares
app.use('/api/hospitals', hopitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);



module.exports = app;