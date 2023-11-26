import {DataTypes} from "sequelize";
import {statuses} from "../config/trialRegistrations.js";
import "dotenv/config"

const getTrialRegistrationModel = sequelize => {
    const TrialRegistration = sequelize.define('trialRegistration', {
        title: DataTypes.STRING,
        parent_name: DataTypes.STRING,
        parent_phone: DataTypes.STRING,
        child_name: DataTypes.STRING,
        child_age: DataTypes.INTEGER,
        date: DataTypes.DATE,
        weekday: DataTypes.STRING,
        time: DataTypes.STRING,
        status: {
            type: DataTypes.ENUM,
            values: statuses,
            default: "start"
        },
    })

    return TrialRegistration
}

export default getTrialRegistrationModel