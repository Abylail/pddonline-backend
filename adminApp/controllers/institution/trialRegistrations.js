import models from "../../../models/index.js";
import {createResponse} from "../../../helpers/responser.js";
import {Op} from "sequelize";

export const getTrialRegistrations = async (req, res) => {
    const {institution_id} = req.params;
    const TODAY_START = new Date()
    const registration = await models.TrialRegistration.findAll({
        order: [['createdAt', 'DESC']],
        where: {
            institution_id,
            date: {
                [Op.gt]: TODAY_START
            }
        },
        include: [
            {model: models.InstitutionGroup, include: [{model: models.InstitutionSubject}]}
        ]
    });
    res.status(200).json(createResponse(registration));
}