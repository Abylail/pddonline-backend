import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import {statuses} from "../../config/trialRegistrations.js";

// Список всех записей
export const getTrialRegistrations = async (req, res) => {
    const registration = await models.TrialRegistration.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {model: models.InstitutionGroup, include: [{model: models.InstitutionSubject}, {model: models.InstitutionBranch}]},
            {model: models.Institution, include: [{model: models.User,  as: "director"}]},
        ]
    });
    res.status(200).json(createResponse(registration));
}

// Обновить статус
export const setStatusTrialRegistrations = async (req, res) => {
    const {registration_id, status} = req.body;
    if (!statuses.includes(status) || !registration_id) return res.status(500).json(createError("Отстуствуют аргументы"));

    const registration = await models.TrialRegistration.findByPk(registration_id);
    if (!registration) return res.status(404).json(createError("Регистрация не найдена"))

    try {
        await models.TrialRegistration.update({status}, {
            where: {id: registration_id},
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить"))
    }

    const updatedRegistration = await models.TrialRegistration.findByPk(registration_id, {
        include: [
            {model: models.InstitutionGroup, include: [{model: models.InstitutionSubject}, {model: models.InstitutionBranch}]},
            {model: models.Institution, include: [{model: models.User,  as: "director"}]},
        ]
    });


    return res.status(200).json(createResponse(updatedRegistration));
}

// Удалить пробный урок
export const deleteTrialRegistration = async (req, res) => {
    const {registration_id} = req.params;
    if (!registration_id) return res.status(500).json(createError("Отстуствуют аргументы"));

    try {
        await models.TrialRegistration.destroy({where: {id: registration_id}}, {
            where: {id: registration_id},
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"))
    }

    return res.status(200).json(createResponse({status: "OK"}))
}