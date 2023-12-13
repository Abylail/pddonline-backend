import models from "../../models/index.js";
import {createResponse} from "../../helpers/responser.js";


export const getList = async (req, res) => {
    const categories = await models.Category.findAll({
        include: {model: models.Subject, as: "subjects"}
    });
    return res.status(200).json(createResponse(categories));
}

export const getSubjects = async (req, res) => {
    const {categoryCode} = req.params;
    const category = await models.Category.findOne({where: {code: categoryCode}});
    const subjects = await category.getSubjects({
        joinTableAttributes: [],
    });
    return res.status(200).json(createResponse(subjects));
}

export const getInstitutionSubjects = async (req, res) => {
    const {categoryCode} = req.params;
    const category = await models.Category.findOne({where: {code: categoryCode}});
    const subjects = await category.getSubjects({
        attributes: ["id"],
        joinTableAttributes: [],
    });
    const institutionSubjects = await models.InstitutionSubject.findAll({
        where: {subject_id: subjects.map(({id}) => id)},
        include: [
            {model: models.InstitutionGroup},
            {model: models.Subject},
            {model: models.Institution}
        ]
    })
    return res.status(200).json(createResponse(institutionSubjects));
}