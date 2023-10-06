import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

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
            parent_name: parent.dataValues.first_name,
            parent_phone: parent.dataValues.phone,
            child_name: child.dataValues.name,
            child_age: child.dataValues.age,
            date: date,
            weekday: weekday,
            time: time,
            institution_group_id: institution_group_id,
            parent_id: parentId,
            child_id: child_id
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать запись"))
    }

    const newRegistration = await models.TrialRegistration.findByPk(registration.dataValues.id, {
        include: [
            {model: models.Child},
            {model: models.Parent},
            {model: models.InstitutionGroup},
        ]
    });

    return res.status(200).json(createResponse(newRegistration))
}