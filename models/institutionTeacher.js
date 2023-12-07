import {DataTypes} from "sequelize";

const getInstitutionTeacherModel = sequelize => {
    const institutionTeacher = sequelize.define('institutionTeacher', {
        full_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        gender: {
            type: DataTypes.ENUM,
            values: ["M", "W"],
            allowNull: true,
        },
        age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        experience: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    })

    return institutionTeacher;
}

export default getInstitutionTeacherModel