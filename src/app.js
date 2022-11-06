const express = require('express')
const session = require('express-session');
const hopitalRoutes = require('../src/api/hospital/hospital.routes');
const doctorRoutes = require('../src/api/doctor/doctor.routes');
const patientRoutes = require('../src/api/patient/patient.routes');

const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(session({cookie: {  path: '/', maxAge: 60000000}, secret: process.env.SECRET_KEY_SESSION}));

//routes 
app.use('/api/hospitals', hopitalRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);



module.exports = app;