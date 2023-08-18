import models from "../../models/index.js";
import {createResponse} from "../../helpers/responser.js";


export const getList = async (req, res) => {
    const categories = await models.Category.findAll();
    return res.status(200).json(createResponse(categories));
}