import models from "../../models/index.js";
import {createError, createResponse, createWhere} from "../../helpers/responser.js";
import {cast, col, Op} from "sequelize";

/** Поиск уроков */
export const searchLessons = async (req, res) => {
    const {
        limit,
        offset,
        subjectId, /* Код урока */
    } = req.query;

    let lessons
    try {
        lessons = await models.InstitutionSubject.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
            where: createWhere({
                subject_id: +subjectId
            }),
            include: [
                {model: models.InstitutionGroup, include: [{model: models.InstitutionBranch}]},
                {model: models.Subject},
                {model: models.Institution},
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить уроки"));

    }

    return res.status(200).json(createResponse(lessons));
}

/** Поиск по центрам */
export const searchCenters = async (req, res) => {
    const {
        limit,
        offset,
        categoryId, /* Код урока */
    } = req.query;

    let availableSubjectIds

    let institutions
    try {
        if (categoryId) {
            const availableSubjects = await models.Subject.findAll({
                include: [
                    { model: models.Category, where: {id: categoryId}, as: "categories", through: "category_subject" }
                ]
            })
            availableSubjectIds = availableSubjects?.map(({id}) => id) || null;
        }

        institutions = await models.Institution.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
            include: [
                {model: models.InstitutionSubject, where: createWhere({subject_id: availableSubjectIds})},
                {model: models.InstitutionBranch},
            ]
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(createError("Не могу получить центры"));

    }

    return res.status(200).json(createResponse(institutions));
}

/** Поиск по филиалам (адресам) */
export const searchBranches = async (req, res) => {
    const {subjectId /* Код урока */, categoryId} = req.query;

    let availableSubjectIds;
    if (categoryId) {
        const availableSubjects = await models.Subject.findAll({
            include: [
                { model: models.Category, where: {id: categoryId}, as: "categories", through: "category_subject" }
            ]
        })
        availableSubjectIds = availableSubjects?.map(({id}) => id) || null;
    }


    const allBranches = await models.InstitutionBranch.findAll({
        where: createWhere({
            "$institution.institutionSubjects.subject_id$": availableSubjectIds || subjectId,
        }),
        include: [
            {
                model: models.Institution,
                include: [{model: models.InstitutionSubject}]
            },
        ]
    });
    return res.status(200).json(createResponse(allBranches))
}