import models from "../../models/index.js";
import {createError, createResponse, createWhere} from "../../helpers/responser.js";

/** Поиск уроков */
export const searchLessons = async (req, res) => {
    const {
        limit,
        offset,
        subjectId, /* Код урока */
        categoryId, /* Код категории */
    } = req.query;

    let availableSubjectIds

    let lessons
    try {
        if (!subjectId && categoryId) {
            const availableSubjects = await models.Subject.findAll({
                include: [
                    { model: models.Category, where: {id: categoryId}, as: "categories", through: "category_subject" }
                ]
            })
            availableSubjectIds = availableSubjects?.map(({id}) => id) || null;
        }

        lessons = await models.InstitutionSubject.findAll({
            limit: +limit || undefined,
            offset: +offset || undefined,
            where: createWhere({
                subject_id: subjectId || availableSubjectIds
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
        subjectId, /* Код урока */
        categoryId, /* Код категории */
    } = req.query;

    let availableSubjectIds

    let institutions
    try {
        if (!subjectId && categoryId) {
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
                {model: models.InstitutionSubject, where: createWhere({subject_id: subjectId || availableSubjectIds})},
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