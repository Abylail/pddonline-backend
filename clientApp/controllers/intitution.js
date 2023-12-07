import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import {cast, col, Op} from "sequelize";

export const getTop = async (req, res) => {
    const {limit, offset} = req.query;

    let institutions
    try {
        institutions = await models.Institution.findAll({
            where: {
                logo: {
                    [Op.ne]: null
                }
            },
            limit: +limit || undefined,
            offset: +offset || undefined,
            order: [
                [ cast(col('rating'), 'FLOAT') , 'DESC' ]
            ],
            include: [
                {model: models.InstitutionSubject, required: true},
                {model: models.InstitutionBranch, required: true},
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
                {model: models.InstitutionGroup, include: [{model: models.InstitutionBranch}, {model: models.InstitutionTeacher}]},
            ]
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Не могу получить центр"));

    }

    return res.status(200).json(createResponse(institution));
}

export const getInstitutionSubjects = async (req, res) => {
    const {id} = req.params;

    if (!id) return res.status(500).json(createError("Нет id центра"))

    const institutionSubjects = await models.InstitutionSubject.findAll({
        where: {institution_id: id},
        include: [
            {model: models.InstitutionGroup},
            {model: models.Subject},
            {model: models.Institution}
        ]
    });

    return res.status(200).json(createResponse(institutionSubjects));
}