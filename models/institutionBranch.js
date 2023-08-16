import {DataTypes} from "sequelize";

const getInstitutionBranchModel = sequelize => {
    const InstitutionBranch = sequelize.define('institutionBranch', {
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address_description: {
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
        two_gis_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        yandex_url: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        coordinates: {
            type: DataTypes.JSON,
            allowNull: true,
        }
    })

    return InstitutionBranch;
}

export default getInstitutionBranchModel