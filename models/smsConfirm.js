import {DataTypes} from "sequelize";
import "dotenv/config"

const getSmsConfirmModel = sequelize => {
    const SmsConfirm = sequelize.define('smsConfirm', {
        phone: {
            type: DataTypes.STRING,
            unique: true
        },
        sms_code: {
            type: DataTypes.STRING,
        },
        tries: {
            type: DataTypes.INTEGER,
            defaultValue: 0
        }
    })

    return SmsConfirm;
}

export default getSmsConfirmModel