import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const categories = await models.ToyCategory.findAll();
    res.status(200).json(createResponse(categories));
}