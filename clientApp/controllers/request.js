import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

// Создать запрос (от родителя)
export const parentRequest = async (req, res) => {
    const parentId = req.parentId;
    const {text, reason} = req.body;

    if (!parentId || !text || !reason) return res.status(500).json(createError("Не хватает аргументов"))

    const parent = await models.Parent.findByPk(parentId);
    if (!parent) return res.status(500).json(createError("Не хватает аргументов"))

    try {
        await models.Request.create({
            text,
            reason,
            authorPhone: parent.dataValues.phone,
            authorName: parent.dataValues.first_name,
            authorType: "parent",
            user_id: parentId
        })
    } catch (e) {
        return res.status(500).json(createError("Ошибка при создании запроса"))
    }

    return res.status(200).json(createResponse({status: "OK"}))
}