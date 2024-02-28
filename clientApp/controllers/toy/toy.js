import {createResponse} from "../../../helpers/responser.js";
import models from "../../../models/index.js";
import {Op} from "sequelize";

const attributes = ["id", "name_ru", "name_kz", "description_ru", "description_kz", "max_age", "min_age", "photos", "price", "life_time", "purpose_ru", "purpose_kz", "material_ru", "material_kz", "size_ru", "size_kz"];


const getToken = (toy) => {
    // время окупаемости
    const okkTime = toy?.price > 12000
        ? toy.life_time/3
        : toy?.price < 5001
            ? 2
            : 3;
    return parseInt((toy.price / okkTime)/120);
}

export const getOne = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findByPk(id, {attributes, include: [
            {model: models.ToyCategory, through: {attributes: []}, as: "categories", attributes: ["id", "name_ru","name_kz", "code"]}
        ]});
    return res.status(200).json(createResponse(toy))
}

export const getList = async (req, res) => {
    const {minAge, maxAge, categoryId} = req.query;

    let toys;

    if (maxAge || minAge || categoryId) {
        let whereObj = {};
        if (minAge) whereObj["max_age"] = {[Op.gte]: minAge}
        if (maxAge) whereObj["min_age"] = {[Op.lte]: maxAge}
        if (categoryId) whereObj["$categories.id$"] = [categoryId]
        toys = await models.Toy.findAll({
            attributes, where: whereObj,
            include: [
                {model: models.ToyCategory, through: {attributes: []}, as: "categories", attributes: []}
            ]
        });
    }
    else toys = await models.Toy.findAll({attributes});

    return res.status(200).json(createResponse(toys.map(t => ({
        ...t.dataValues,
        price: undefined,
        life_time: undefined,
        token: getToken(t),
    }))));
}