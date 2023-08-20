import {DataTypes} from "sequelize";

const getSubjectModel = sequelize => {
    const Subject = sequelize.define('subject', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        is_sport: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        color: {
            type: DataTypes.STRING,
            allowNull: true
        }
    })

    return Subject
}

export default getSubjectModel