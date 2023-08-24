import {DataTypes} from "sequelize";

const getInstitutionSubjectModel = sequelize => {
    const InstitutionSubject = sequelize.define('institutionSubject', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        photos: {
            type: DataTypes.JSON,
            allowNull: true,
        },
    })

    return InstitutionSubject;
}

export default getInstitutionSubjectModel