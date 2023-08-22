import {DataTypes} from "sequelize";
import bcrypt from "bcrypt";
import "dotenv/config"

const getUserModel = sequelize => {
    const User = sequelize.define('user', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        phone: DataTypes.STRING,
        password: DataTypes.STRING,
    })

    // Hash the user password before saving to the database
    User.beforeCreate(async user => {
        const hashedPassword = await bcrypt.hash(user.dataValues.password, 10);
        user.password = hashedPassword;
    });

    return User;
}

export default getUserModel