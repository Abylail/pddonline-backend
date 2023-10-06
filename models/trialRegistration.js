import {DataTypes} from "sequelize";
import "dotenv/config"

const getTrialRegistrationModel = sequelize => {
    const TrialRegistration = sequelize.define('trialRegistration', {
        parent_name: DataTypes.STRING,
        parent_phone: DataTypes.STRING,
        child_name: DataTypes.STRING,
        child_age: DataTypes.INTEGER,
        date: DataTypes.DATE,
        weekday: DataTypes.STRING,
        time: DataTypes.STRING,
    })

    return TrialRegistration
}

export default getTrialRegistrationModel