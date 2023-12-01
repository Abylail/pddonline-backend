import models from "../../../models/index.js";
import {createResponse} from "../../../helpers/responser.js";

export const getTrialRegistrations = async (req, res) => {
    const {institution_id} = req.params;
    const registration = await models.TrialRegistration.findAll({
        order: [['createdAt', 'DESC']],
        where: {
            institution_id,
        },
        include: [
            {model: models.InstitutionGroup, include: [{model: models.InstitutionSubject}]}
        ]
    });
    res.status(200).json(createResponse(registration));
}