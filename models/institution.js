import {DataTypes} from "sequelize";

const getInstitutionModel = sequelize => {
    const Institution = sequelize.define('institution', {
        name: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        code: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
        },
        logo: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        photos: {
          type: DataTypes.JSON,
          allowNull: true,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        start_time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        end_time: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        call_phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        whatsapp_phone: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        instagram_url: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        type: {
            type: DataTypes.ENUM,
            values: ["center"],
            defaultValue: "center",
            allowNull: false
        }
    })

    return Institution;
}

export default getInstitutionModel