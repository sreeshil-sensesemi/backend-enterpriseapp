const dbConfig = require('./database.config')
const {Sequelize, DataTypes} = require('sequelize')


const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,{
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        operatorsAliases: false,


        pool : {
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


db.sequelize.sync({ force: false})
.then(() => {
    console.log('re-sync done');
})




module.exports = db