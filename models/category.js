import {DataTypes} from "sequelize";

const getCategoryModel = sequelize => {
    const Category = sequelize.define('category', {
        name: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    })

    return Category
}

export default getCategoryModel