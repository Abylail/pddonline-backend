import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getList = async (req, res) => {
    const roles = await models.Role.findAll();
    res.status(200).json(createResponse(roles));
}

export const createRole = async (req, res) => {
    const {title, code} = req.body;

    try {
        await models.Role.create({title, code});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const deleteRole = async (req, res) => {
    const {code} = req.params;

    try {
        await models.Role.destroy({where: {code}});
    } catch (e) {
        res.status(500).json(createError("Не могу удалить"));
    }

    res.status(200).json({status: "OK"})
}