import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {statuses} from "../../../config/trialRegistrations.js";

export const getList = async (req, res) => {
    const requests = await models.ToySubscribeRequest.findAll();
    res.status(200).json(createResponse(requests));
}

export const updateStatus = async (req, res) => {
    const {request_id} = req.params;
    const {status, comment} = req.body;
    if (!request_id || !statuses.includes(status)) return res.status(500).json(createError("Нет аргументов"))

    try {
        await models.ToySubscribeRequest.update({status, comment}, {where: {id: request_id}});
    } catch (e) {
        res.status(500).json(createError("Не могу обновить"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}