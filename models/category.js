import {DataTypes} from "sequelize";

const getCategoryModel = sequelize => {
    const Category = sequelize.define('category', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false
        }
    })

    return Category
}

export default getCategoryModel