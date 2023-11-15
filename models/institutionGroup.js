import {DataTypes} from "sequelize";

const getInstitutionGroupModel = sequelize => {
    const InstitutionGroup = sequelize.define('institutionGroup', {
        price: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        price_trial: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        min_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_age: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        max_children_count: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        language_ru: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        language_kz: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        open_enrollment: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        monday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        monday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tuesday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        tuesday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        wednesday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        wednesday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thursday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        thursday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        friday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        friday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        saturday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        saturday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sunday_start: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        sunday_end: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    })

    return InstitutionGroup;
}

export default getInstitutionGroupModel