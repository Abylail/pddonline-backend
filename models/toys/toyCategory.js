import {DataTypes} from "sequelize";

const getToyCategoryModel = sequelize => {
    const ToyCategory = sequelize.define('toyСategory', {
        name_ru: {
            type: DataTypes.STRING,
            allowNull: false
        },
        name_kz: {
            type: DataTypes.STRING,
            allowNull: false
        },
        icon_mdi: {
            type: DataTypes.STRING,
            allowNull: true
        },
        code: {
            type: DataTypes.STRING,
            allowNull: false
        }
    })

    return ToyCategory
}

export default getToyCategoryModel