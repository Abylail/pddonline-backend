import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {removeFile, uploadFile} from "../../../services/image.js";

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

export const addPhoto = async (req, res) => {
    const {institution_id, institution_subject_id} = req.params;
    const institutionSubject = await models.InstitutionSubject.findOne({where: {id: institution_subject_id, institution_id}});
    if (!institution_id || !institutionSubject) return res.status(500).json(createError("Предмет не найден"));

    // Массив фоток
    let photos = institutionSubject.dataValues.photos || [];

    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "institution");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));
    photos.push(filePath);

    try {
        // Сохранение в базе новой картинки
        await models.InstitutionSubject.update(
            {photos},
            {where: {id: institution_subject_id, institution_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}

export const removePhoto = async (req, res) => {
    const {institution_id, institution_subject_id} = req.params;
    const institutionSubject = await models.InstitutionSubject.findOne({where: {id: institution_subject_id, institution_id}});
    if (!institution_id || !institutionSubject) return res.status(500).json(createError("Предмет не найден"));

    const {imagePath} = req.body;
    if (!imagePath) return res.status(500).json(createError("Нет ссылки на картинку"));

    let photos = institutionSubject.dataValues.photos || [];
    const photoIndex = photos.indexOf(imagePath);
    if (photoIndex > -1) {
        await removeFile(imagePath);
        photos.splice(photoIndex, 1);
    }

    try {
        // Сохранение в базе новой картинки
        await models.InstitutionSubject.update(
            {photos},
            {where: {id: institution_subject_id, institution_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить"))
    }

    res.status(200).json({status: "OK", photos})
}