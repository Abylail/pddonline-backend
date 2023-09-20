import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getFeed = async (req, res) => {
    const {limit, offset} = req.query;
    let subjects

    try {
        subjects = await models.InstitutionSubject.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
            include: [
                {model: models.InstitutionGroup, include: [{model: models.InstitutionBranch}]},
                {model: models.Subject},
                {model: models.Institution},
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить предметы"));
    }

    return res.status(200).json(createResponse(subjects));
}

export const getSubjectDetails = async (req, res) => {
    const {id} = req.params;
    let subject

    try {
        subject = await models.InstitutionSubject.findByPk(id, {
            include: [
                {model: models.InstitutionGroup},
                {model: models.Subject},
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить предмет"));
    }

    return res.status(200).json(createResponse(subject));
}