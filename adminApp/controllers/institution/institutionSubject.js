import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getSubjectList = async (req, res) => {
    const {institution_id} = req.params;
    const subjects = await models.InstitutionSubject.findAll({where: {institution_id}, include: {model: models.Subject}})
    return res.status(200).json(createResponse(subjects));
}

export const createSubject = async (req, res) => {
    const {institution_id} = req.params;
    const {subject_id, name, description} = req.body;

    if (!subject_id || !name) return res.status(500).json(createError("Недостаточно параметров для создания"));

    const subject = await models.Subject.findByPk(subject_id);
    if (!subject) return res.status(500).json(createError("Нет такого предмета"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Нет центра"));

    let newInstitutionSubject;

    try {
        newInstitutionSubject = await models.InstitutionSubject.create({
            name, description
        });
        await newInstitutionSubject.setInstitution(institution);
        await newInstitutionSubject.setSubject(subject);
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    return res.status(200).json(createResponse(newInstitutionSubject));
}

export const updateSubject = async (req, res) => {
    const {institution_id, institution_subject_id} = req.params;
    const {name, description} = req.body;

    if (!name || !description) return res.status(500).json(createError("Недостаточно параметров для создания"));

    const institutionSubject = await models.InstitutionSubject.findByPk(institution_subject_id);
    if (!institutionSubject) return res.status(500).json(createError("Нет такого предмета"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Нет центра"));

    let newInstitutionSubject
    try {
        [,newInstitutionSubject] = await models.InstitutionSubject.update(
            {name, description},
            {where: {id: institution_subject_id}, returning: true, plain: true}
        );
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"));
    }

    return res.status(200).json(createResponse(newInstitutionSubject));
}

export const deleteSubject = async (req, res) => {
    const {institution_id, institution_subject_id} = req.params;

    try {
        await models.InstitutionSubject.destroy({where: {id: institution_subject_id, institution_id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"});
}