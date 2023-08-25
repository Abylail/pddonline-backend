import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import {cast, col} from "sequelize";

export const getTop = async (req, res) => {
    const {limit, offset} = req.query;

    let institutions
    try {
        institutions = await models.Institution.findAll({
            limit: +limit || 5,
            offset: +offset || 0,
            order: [
                [ cast(col('rating'), 'FLOAT') , 'DESC' ]
            ],
            include: [
                {model: models.InstitutionSubject},
                {model: models.InstitutionBranch},
            ]
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить центры"));

    }

    return res.status(200).json(createResponse(institutions));
}