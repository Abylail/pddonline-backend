import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {Op} from "sequelize";
import {sendSmsService} from "../../../services/sendSms.js";
import {weekdaysDictionary} from "../../../config/weekdays.js";
import {planAction} from "../../../services/planAction.js";

// Регистраций на пробный урок
export const registerTrial = async (req, res) => {

    const parentId = req.parentId;
    const {child_id, date, weekday, time, institution_group_id} = req.body;
    if (!child_id || !date || !weekday || !time || !institution_group_id) return res.status(500).json(createError("Отсутствуют аргументы"));

    let parent, child, institutionGroup

    let registration
    try {
        [parent, child, institutionGroup] = await Promise.all([
            models.Parent.findByPk(parentId),
            models.Child.findByPk(child_id),
            models.InstitutionGroup.findByPk(institution_group_id),
        ])

        if (!parent || !child || !institutionGroup) return res.status(500).json(createError("Неправильные аргумент"))

        registration = await models.TrialRegistration.create({
            title: "Пробный урок",
            parent_name: parent.dataValues.first_name,
            parent_phone: parent.dataValues.phone,
            child_name: child.dataValues.name,
            child_age: child.dataValues.age,
            date: date,
            weekday: weekday,
            time: time,
            institution_group_id: institution_group_id,
            institution_id: institutionGroup.dataValues.institution_id,
            parent_id: parentId,
            child_id: child_id
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать запись"))
    }

    const newRegistration = await models.TrialRegistration.findByPk(registration.dataValues.id, {
        include: [
            {model: models.Child},
            {model: models.InstitutionGroup},
        ]
    });

    // Отправка напоминания клиенту
    try {
        const trialDay = new Date(date);
        const [hour] = time?.split(":");
        trialDay.setUTCHours(hour);
        trialDay.setHours(trialDay.getHours() - 3);
        planAction([trialDay.getUTCDay(), trialDay.getUTCMonth()+1, trialDay.getHours(), 0], () => {
            sendSmsService(parent.dataValues.phone, `Kidup.kz напоминаем вам о записи на пробный урок (${weekdaysDictionary[weekday]} ${time}). Подробнее https://kidup.kz/account`);
        })
    } catch (e) {}

    // Отправка смс клиенту
    await sendSmsService(parent.dataValues.phone, `Kidup.kz, вы записались на пробный урок (${weekdaysDictionary[weekday]} ${time}). Подробнее https://kidup.kz/account`);

    // Отправка смс центру
    const director = await models.User.findOne({where: {institution_id: institutionGroup.dataValues.institution_id}})
    if (director) await sendSmsService(director.dataValues.phone, `Kidup.kz, к вам запись (${child.dataValues.name} ${weekdaysDictionary[weekday]} ${time}). Подробнее: https://kidup.kz/adminpanel`);

    return res.status(200).json(createResponse(newRegistration))
}

// Запрос на звонок
export const callRequest = async (req, res) => {
    const parentId = req.parentId;
    const institutionId = req.params.institution_id;
    const [parent, institution] = await Promise.all([models.Parent.findByPk(parentId), models.Institution.findByPk(institutionId)])
    if (!parent || !institution) return res.status(500).json(createError("Неправильные аргумент"));
    await models.TrialRegistration.create({
        title: "Запрос на звонок",
        parent_name: parent.dataValues.first_name,
        parent_phone: parent.dataValues.phone,
        child_name: null,
        child_age: null,
        date: null,
        weekday: null,
        time: null,
        institution_group_id: null,
        institution_id: institutionId,
        parent_id: parentId,
        child_id: null
    })

    // Отправка смс центру
    const director = await models.User.findOne({where: {institution_id: institutionId}})
    if (director) await sendSmsService(director.dataValues.phone, `Kidup.kz, клиент просит позвонить (${parent.dataValues.phone}). Подробнее: https://kidup.kz/adminpanel`);

    return res.status(200).json({status: "OK"})
}

// Список активных записей
export const registerActiveTrialList = async (req, res) => {
    const parentId = req.parentId;
    const TODAY_START = new Date()

    let list

    try {
        list = await models.TrialRegistration.findAll({
            order: [['date', 'ASC']],
            where: {
                parent_id: parentId,
                date: {
                    [Op.gt]: TODAY_START
                }
            },
            include: [
                {model: models.Child},
                {model: models.Institution},
                {
                    model: models.InstitutionGroup, include: [
                        {model: models.Institution},
                        {model: models.InstitutionBranch},
                        {model: models.InstitutionSubject},
                    ]
                },
            ]
        })
    } catch (e) {
        return res.status(500).json(createError("Ошибка получения списка записей"))
    }

    return res.status(200).json(createResponse(list));
}

// Список активных записей
export const registerGetTrial = async (req, res) => {
    const parentId = req.parentId;
    const { trialId } = req.params;

    if (!trialId) return res.status(500).json(createError("Нет id записи"))

    let item

    try {
        item = await models.TrialRegistration.findOne({
            where: {id: trialId, parent_id: parentId},
            include: [
                {model: models.Child},
                {
                    model: models.InstitutionGroup, include: [
                        {model: models.Institution},
                        {model: models.InstitutionBranch},
                        {model: models.InstitutionSubject},
                    ]
                },
            ]
        })
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Ошибка получения записи"))
    }

    return res.status(200).json(createResponse(item));
}