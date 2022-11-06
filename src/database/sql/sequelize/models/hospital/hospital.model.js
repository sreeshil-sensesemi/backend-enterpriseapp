module.exports = (sequelize, DataTypes) => {
    
    const Hospital = sequelize.define("hospital", {
        HospitalID: {
            type: DataTypes.UUID,
            allowNull: false,
            unique: true
        },
        HospitalName: {
            type: DataTypes.STRING,
            allowNull: false,
             
        },
        PhoneNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        Email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        City: {
            type: DataTypes.STRING,
            allowNull: false,

        }
    })

    return Hospital;
}