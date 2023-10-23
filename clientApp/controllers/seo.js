import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";


export const seoOptions = async (req, res) => {
    let categories, subjects, lessons, centers

    try {
        [categories, subjects, lessons, centers] = await Promise.all([
            models.Category.findAll({attributes: ["code"], raw: true}),
            models.Subject.findAll({attributes: ["code"], raw: true}),
            models.InstitutionSubject.findAll({attributes: ["id"], raw: true}),
            models.Institution.findAll({attributes: ["id"], raw: true}),
        ])
    } catch (e) {
        return res.status(500).json(createError("Не могу получить опции"))
    }

    return res.status(200).json(createResponse({
        categories: categories.map(({code}) => code),
        subjects: subjects.map(({code}) => code),
        lessons: lessons.map(({id}) => id),
        centers: centers.map(({id}) => id),
    }))
}