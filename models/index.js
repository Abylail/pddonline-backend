import {Sequelize, Op} from "sequelize";
import 'dotenv/config';

import getUserModel from "./user.js";
import getQuestionModel from "./question.js";

const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USER, process.env.DATABASE_PASSWORD, {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    operatorsAliases: {
        $like: Op.like,
    },
    logging: false
});

const models = {
    User: getUserModel(sequelize),
    Question: getQuestionModel(sequelize),
}

export {sequelize};

export default models;