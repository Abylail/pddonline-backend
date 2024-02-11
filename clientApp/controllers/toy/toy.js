import {createResponse} from "../../../helpers/responser.js";
import models from "../../../models/index.js";

export const getList = async (req, res) => {
    const toys = await models.Toy.findAll();
    return res.status(200).json(createResponse(toys));
}