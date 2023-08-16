import models from "../../models/index.js";
import {createResponse} from "../../helpers/responser.js";

export const getList = async (req, res) => {
    const parents = models.Parent.findAll();
    res.status(200).json(createResponse(parents));
}