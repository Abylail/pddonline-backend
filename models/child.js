import {DataTypes} from "sequelize";
import "dotenv/config"

const getChildModel = sequelize => {
    const Child = sequelize.define('child', {
        name: DataTypes.STRING,
        username: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING
    })

    return Child;
}

export default getChildModel