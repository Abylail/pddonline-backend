import {DataTypes} from "sequelize";
import "dotenv/config"

const getToyModel = sequelize => {
    const Toy = sequelize.define('toy', {
        name_ru: DataTypes.STRING,
        name_kz: DataTypes.STRING,
        description_ru: DataTypes.TEXT,
        description_kz: DataTypes.TEXT,
        max_age: {
            type: DataTypes.INTEGER,
            default: 8
        },
        min_age: {
            type: DataTypes.INTEGER,
            default: 0
        },
        photos: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        kaspiUrl: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        price: {
            type: DataTypes.INTEGER
        },
        life_time: {
            type: DataTypes.INTEGER
        },

    })

    return Toy;
}

export default getToyModel