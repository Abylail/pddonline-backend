import {DataTypes} from "sequelize";
import "dotenv/config"

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
        }
    })

    return ToySubscribeRequest;
}

export default getToySubscribeRequestModel;