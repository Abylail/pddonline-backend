import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import {cast, col} from "sequelize";

export const getTop = async (req, res) => {
    const {limit, offset} = req.query;

    let institutions
    try {
        institutions = await models.Institution.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
            order: [
                [ cast(col('rating'), 'FLOAT') , 'DESC' ]
            ],
            include: [
                {model: models.InstitutionSubject},
                {model: models.InstitutionBranch},
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить центры"));

    }

    return res.status(200).json(createResponse(institutions));
}

export const getInstitutionDetails = async (req, res) => {
    const {id} = req.params;
    let institution

    try {
        institution = await models.Institution.findByPk(id, {
            include: [
                {model: models.InstitutionSubject},
                {model: models.InstitutionBranch},
                {model: models.InstitutionGroup, include: [{model: models.InstitutionBranch}]},
            ]
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Не могу получить центр"));

    }

    return res.status(200).json(createResponse(institution));
}