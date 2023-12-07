import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {removeFile, uploadFile} from "../../../services/image.js";

export const getTeacherList = async (req, res) => {
    const {institution_id} = req.params;
    const teachers = await models.InstitutionTeacher.findAll({where: {institution_id}})
    return res.status(200).json(createResponse(teachers));
}

export const createTeacher = async (req, res) => {
    const {institution_id} = req.params;
    const {full_name, gender, age, description, experience} = req.body;

    if (!full_name) return res.status(500).json(createError("Недостаточно параметров для создания"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Нет центра"));

    let newInstitutionTeacher;

    try {
        newInstitutionTeacher = await models.InstitutionTeacher.create({
            full_name, gender, age, description, experience
        });
        await newInstitutionTeacher.setInstitution(institution);
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    return res.status(200).json(createResponse(newInstitutionTeacher));
}

export const updateTeacher = async (req, res) => {
    const {institution_id, teacher_id} = req.params;
    const {full_name, gender, age, description, experience} = req.body;

    if (!full_name) return res.status(500).json(createError("Недостаточно параметров для создания"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Нет центра"));

    let newInstitutionTeacher
    try {
        [,newInstitutionTeacher] = await models.InstitutionTeacher.update(
            {full_name, gender, age, description, experience},
            {where: {id: teacher_id}, returning: true, plain: true}
        );
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"));
    }

    return res.status(200).json(createResponse(newInstitutionTeacher));
}

export const deleteTeacher = async (req, res) => {
    const {institution_id, teacher_id} = req.params;

    try {
        await models.InstitutionTeacher.destroy({where: {id: teacher_id, institution_id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"});
}

export const uploadTeacherPhoto = async (req, res) => {
    const {institution_id, teacher_id} = req.params;
    const teacher = await models.InstitutionTeacher.findByPk(teacher_id);
    if (!teacher_id || !teacher) return res.status(500).json(createError("Учитель не найден"));

    // Удаляю старую картинку
    if (typeof teacher.dataValues.photo === "string") await removeFile(teacher.dataValues.photo)

    // Загружаю новую фотку
    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "institutionTeacher");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));

    try {
        // Сохранение в базе новой картинки
        await models.InstitutionTeacher.update(
            {photo: filePath},
            {where: {id: teacher_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}