import {DataTypes} from "sequelize";
import "dotenv/config"
import {statuses} from "../../config/trialRegistrations.js";

const getToySubscribeRequestModel = sequelize => {
    const ToySubscribeRequest = sequelize.define('toySubscribeRequest', {
        phone: {
            type: DataTypes.STRING,
        },
        cart: {
            type: DataTypes.JSON,
        },
        rate: {
            type: DataTypes.JSON,
        },
        status: {
            type: DataTypes.STRING,
            values: statuses,
            default: "start"
        },
        comment: {
            type: DataTypes.STRING,
            default: ""
        }
    })

    return ToySubscribeRequest;
}

export default getToySubscribeRequestModel;