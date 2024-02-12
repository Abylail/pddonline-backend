import {createError, createResponse} from "../../../helpers/responser.js";
import models from "../../../models/index.js";

export const parentRequestToySubscribe = async (req, res) => {
    const parentId = req.parentId;
    const {cart, rate} = req.body;

    if (!parentId || !cart || !rate) return res.status(500).json(createError("Не хватает аргументов"))

    const parent = await models.Parent.findByPk(parentId);
    if (!parent) return res.status(500).json(createError("Не хватает аргументов"))

    try {
        await models.ToySubscribeRequest.create({
            phone: parent.dataValues.phone,
            cart,
            rate,
        })
    } catch (e) {
        return res.status(500).json(createError("Ошибка при создании запроса"))
    }

    return res.status(200).json(createResponse({status: "OK"}))
}