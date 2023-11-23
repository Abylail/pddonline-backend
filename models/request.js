import {DataTypes} from "sequelize";

const getQuestionRequestModel = sequelize => {
    const QuestionRequest = sequelize.define('questionRequest', {
        reason: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        text: {
            type: DataTypes.STRING,
            unique: false,
            allowNull: false,
        },
        authorType: {
            type: DataTypes.ENUM,
            values: ["parent", "center"]
        },
        authorPhone: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        authorName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    })

    return QuestionRequest;
}

export default getQuestionRequestModel