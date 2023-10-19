import {DataTypes} from "sequelize";

const getRequestModel = sequelize => {
    const Request = sequelize.define('request', {
        reason: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        authorType: {
            type: DataTypes.ENUM,
            values: ["parent", "center"]
        },
        authorPhone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return Request;
}

export default getRequestModel