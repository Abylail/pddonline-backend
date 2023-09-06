import {DataTypes} from "sequelize";
import "dotenv/config"

const getChildModel = sequelize => {
    const Child = sequelize.define('child', {
        name: DataTypes.STRING,
        username: DataTypes.STRING,
        age: DataTypes.INTEGER,
        gender: {
          type: DataTypes.ENUM,
          values: ["M", "W"]
        },
        password: DataTypes.STRING
    })

    return Child;
}

export default getChildModel