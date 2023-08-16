import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getGroupList = async (req, res) => {
    const {institution_id} = req.params;
    const groups = await models.InstitutionGroup.findAll({
        where: {institution_id},
        include: [
            {model: models.InstitutionSubject},
            {model: models.InstitutionBranch},
        ]
    });

    return res.status(200).json(createResponse(groups));
}

export const createGroup = async (req, res) => {
    const {institution_id} = req.params;
    const {
        institution_branch_id, institution_subject_id,
        price, price_trial,
        min_age, max_age, max_children_count,
        language_ru, language_kz,
        monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end
    } = req.body;

    if (!institution_id || !institution_branch_id || !institution_subject_id) return res.status(500).json(createError("Не хватает аргументов"));

    if (!((monday_start && monday_end) || (tuesday_start && tuesday_end) || (wednesday_start && wednesday_end) || (thursday_start && thursday_end) || (friday_start && friday_end) || (saturday_start && saturday_end) || (sunday_start && sunday_end))) return res.status(500).json(createError("Выберите хотя бы один день"));

    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(500).json(createError("Нет центра"));

    const institutionBranch = await models.InstitutionBranch.findOne({where: {id: institution_branch_id, institution_id}});
    if (!institutionBranch) return res.status(500).json(createError("Нет филиала"));

    const institutionSubject = await models.InstitutionSubject.findOne({where: {id : institution_subject_id, institution_id}});
    if (!institutionSubject) return res.status(500).json(createError("Нет предмета"));

    let newInstitutionGroup
    try {
        newInstitutionGroup = await models.InstitutionGroup.create({
            price, price_trial,
            min_age, max_age, max_children_count,
            language_ru, language_kz,
            monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end
        })
        await newInstitutionGroup.setInstitution(institution);
        await newInstitutionGroup.setInstitutionBranch(institutionBranch);
        await newInstitutionGroup.setInstitutionSubject(institutionSubject);
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"));
    }

    const group = await models.InstitutionGroup.findOne({
        where: {id: newInstitutionGroup.dataValues.id, institution_id},
        include: [
            {model: models.InstitutionSubject},
            {model: models.InstitutionBranch},
        ]
    });

    return res.status(200).json(createResponse(group))
}

export const updateGroup = async (req, res) => {
    const {institution_id, institution_group_id} = req.params;
    const {
        institution_branch_id, institution_subject_id,
        price, price_trial,
        min_age, max_age, max_children_count,
        language_ru, language_kz,
        monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end
    } = req.body;

    if (!institution_id || !institution_group_id) return res.status(500).json(createError("Не хватает аргументов"));

    if (!((monday_start && monday_end) || (tuesday_start && tuesday_end) || (wednesday_start && wednesday_end) || (thursday_start && thursday_end) || (friday_start && friday_end) || (saturday_start && saturday_end) || (sunday_start && sunday_end))) return res.status(500).json(createError("Выберите хотя бы один день"));

    const oldInstitutionGroup = await models.InstitutionGroup.findOne({where: {id: institution_group_id, institution_id}});
    if (!oldInstitutionGroup) return res.status(500).json(createError("Нет такой группы"));

    let updatedInstitutionGroup
    try {
        [, updatedInstitutionGroup] = await models.InstitutionGroup.update({
            price, price_trial,
            min_age, max_age, max_children_count,
            language_ru, language_kz,
            monday_start, monday_end, tuesday_start, tuesday_end, wednesday_start, wednesday_end, thursday_start, thursday_end, friday_start, friday_end, saturday_start, saturday_end, sunday_start, sunday_end
        }, {
            where: {id: institution_group_id, institution_id},
            returning: true, plain: true
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"))
    }

    if (oldInstitutionGroup.dataValues.institution_branch_id !== institution_branch_id) {
        const institutionBranch = await models.InstitutionBranch.findOne({where: {id: institution_branch_id, institution_id}});
        if (!institutionBranch) return res.status(500).json(createError("Нет филиала"));
        await updatedInstitutionGroup.setInstitutionBranch(institutionBranch);
    }

    if (oldInstitutionGroup.dataValues.institution_subject_id !== institution_subject_id) {
        const institutionSubject = await models.InstitutionSubject.findOne({where: {id: institution_subject_id, institution_id}});
        if (!institutionSubject) return res.status(500).json(createError("Нет предмета"));
        await updatedInstitutionGroup.setInstitutionSubject(institutionSubject);
    }

    const group = await models.InstitutionGroup.findOne({
        where: {id: institution_group_id, institution_id},
        include: [
            {model: models.InstitutionSubject},
            {model: models.InstitutionBranch},
        ]
    });

    return res.status(200).json(createResponse(group));
}

export const deleteGroup = async (req, res) => {
    const {institution_id, institution_group_id} = req.params;

    try {
        await models.InstitutionGroup.destroy({where: {id: institution_group_id, institution_id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"});
}