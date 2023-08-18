import {DataTypes} from "sequelize";

const getRoleModel = sequelize => {
    const Role = sequelize.define('role', {
        title: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
    }, {
        timestamps: false
    })

    return Role;
}

export default getRoleModel