import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

// Получить все запросы
export const getRequests = async (req, res) => {
    const requests = await models.QuestionRequest.findAll();
    return res.status(200).json(createResponse(requests));
}

// Обновить запрос
export const updateRequest = async (req, res) => {
    const {status, managerComment} = req.body;
    const {request_id} = req.params;

    try {
        await models.QuestionRequest.update({status, managerComment}, {where: {id: request_id}})
    } catch (e) {
        return res.status(500).json(createError("Ошибка при обновлени"))
    }

    return res.status(200).json({status: "OK"});
}

export const deleteRequest = async (req, res) => {
    const {request_id} = req.params;

    try {
        await models.QuestionRequest.destroy({where: {id: request_id}})
    } catch (e) {
        return res.status(500).json(createError("Ошибка при удалении"))
    }

    return res.status(200).json({status: "OK"});
}
