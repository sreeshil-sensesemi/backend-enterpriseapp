const dbConfig = require('./database.config')
const { Sequelize, DataTypes } = require('sequelize')




const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorsAliases: false,


    pool: {
        max: dbConfig.pool.max,
        min: dbConfig.pool.min,
        acquire: dbConfig.pool.acquire,
        idle: dbConfig.pool.idle
    }
}
)

sequelize.authenticate()
    .then(() => {
        console.log('connected');
    })
    .catch(err => {
        console.log('Error' + err);
    })

const db = {}

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hospitals = require('./models/hospital/hospital.model')(sequelize, DataTypes)
db.doctors = require('./models/doctor/doctor.model')(sequelize, DataTypes)
db.patients = require('./models/patient/patient.model')(sequelize, DataTypes)


db.sequelize.sync({ force:false })
    .then(() => {
        console.log('re-sync done');
    })




module.exports = db









// //const config = require('config.json');
// const mysql = require('mysql2/promise');
// //const { Sequelize } = require('sequelize');



// initialize();

// async function initialize() {
//     try {

//         // create db if it doesn't already exist
//         const { HOST: host, PORT: port, USER: user, PASSWORD: password, DB: database } = dbConfig;

//         const connection = await mysql.createConnection({ host, port, user, password });
//         await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);




//         // connect to db
//         const sequelize = new Sequelize(
//             dbConfig.DB,
//             dbConfig.USER,
//             dbConfig.PASSWORD, {
//             host: dbConfig.HOST,
//             dialect: dbConfig.dialect,
//             operatorsAliases: false,


//             pool: {
//                 max: dbConfig.pool.max,
//                 min: dbConfig.pool.min,
//                 acquire: dbConfig.pool.acquire,
//                 idle: dbConfig.pool.idle
//             }
//         }
//         )

//         //authenticate db
//         await sequelize.authenticate()
//             .then(() => {
//                 console.log('connected');
//             })
//             .catch(err => {
//                 console.log('Error' + err);
//             })

//         const db = {}

//         db.Sequelize = Sequelize;
//         db.sequelize = sequelize;

//         // init models and add them to the exported db object
//         db.hospitals = require('./models/hospital/hospital.model')(sequelize, DataTypes)
//         db.doctors = require('./models/doctor/doctor.model')(sequelize, DataTypes)
//         db.patients = require('./models/patient/patient.model')(sequelize, DataTypes)


//         // sync all models with database
//         // await sequelize.sync().then(() => { console.log("re-sync done") });
//         await db.sequelize.sync({ alter: true })
//             .then(() => {
//                 console.log('re-sync done');
//             })
//         console.log('connected to database');

//     } catch (error) {
//         console.log(error);
//     }
// }

// module.exports = db 