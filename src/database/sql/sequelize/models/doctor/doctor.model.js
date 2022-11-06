module.exports = (sequelize, DataTypes) => {
    
    const Doctor = sequelize.define("doctor", {
        DoctorID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        FirstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        LastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        RegistrationNo: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Specialization: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        StateMedicalCouncil: {
            type: DataTypes.UUID,
            allowNull: false,
        },
        PractisingSince: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Age: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        Gender: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        Mobile: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        State: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    return Doctor;
}