import {DataTypes} from "sequelize";
import bcrypt from "bcrypt";
import "dotenv/config"

const getQuestionModel = sequelize => {
    const Question = sequelize.define('question', {
        title_ru: DataTypes.STRING,
        title_kz: DataTypes.STRING,
        correct_answer_code: DataTypes.STRING,
        options: DataTypes.JSON,
        media: DataTypes.STRING
    })

    return Question;
}

export default getQuestionModel