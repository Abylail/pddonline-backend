import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getFeed = async (req, res) => {
    const {limit, offset} = req.query;
    let subjects

    try {
        subjects = await models.InstitutionSubject.findAll({
            limit: +limit || 5,
            offset: +offset || 0,
            include: [
                {model: models.InstitutionGroup},
                {model: models.Subject},
                {model: models.Institution}
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не верные параметры"));
    }

    return res.status(200).json(createResponse(subjects));
}