import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";


export const getList = async (req, res) => {
    const {limit, offset} = req.query;
    let subjects

    try {
        subjects = await models.Subject.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
        });
    } catch (e) {
        return res.status(500).json(createError("Не верные параметры"));
    }

    return res.status(200).json(createResponse(subjects));
}