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
        status: {
            type: DataTypes.STRING,
            values: ["start", "processed", "later", "no_answer"],
            default: "start"
        },
        managerComment: {
            type: DataTypes.STRING,
        }
    })

    return QuestionRequest;
}

export default getQuestionRequestModel