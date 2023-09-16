import models from "../../models/index.js";
import {createError, createResponse, createWhere} from "../../helpers/responser.js";

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