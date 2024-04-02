import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getList = async (req, res) => {
    const questions = await models.Question.findAll();

    res.status(200).json(createResponse(questions));
}

export const getOne = async (req, res) => {
    const {id} = req.params;
    const question = await models.Question.findByPk(id);
    if (!question) return res.status(404).json(createError("Вопрос не найден"));
    res.status(200).json(createResponse(question));
}

export const createQuestion = async (req, res) => {
    const {title_ru, title_kz, correct_answer_code, options} = req.body;
    if (!title_ru || !title_kz || !correct_answer_code || !options) return res.status(500).json(createError("Нет параматеров"));

    const sameQuestion = await models.Question.findOne({ where: {title_ru} });
    if (sameQuestion) return res.status(500).json(createError("Такой вопрос уже есть"));

    try {
        await models.Question.create({
            title_ru, title_kz, correct_answer_code, options
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать вопрос"));
    }

    const newQuestion = await models.Question.findOne({ where: {title_ru, title_kz} });
    res.status(200).json(createResponse(newQuestion));
}


export const updateQuestion = async (req, res) => {
    const {id} = req.params;
    const {title_ru, title_kz, correct_answer_code, options} = req.body;

    try {
        await models.Question.update({
            title_ru, title_kz, correct_answer_code, options
        }, {where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить вопрос"));
    }

    const updatedQuestion = await models.Question.findByPk(id);
    res.status(200).json(createResponse(updatedQuestion));
}

export const deleteQuestion = async (req, res) => {
    const {id} = req.params;

    await models.Question.destroy({where: {id}})
    return res.status(200).json({status: "OK"})
}