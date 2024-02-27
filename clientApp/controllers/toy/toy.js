import {createResponse} from "../../../helpers/responser.js";
import models from "../../../models/index.js";
import {Op} from "sequelize";

const getToken = (toy) => {
    // время окупаемости
    const okkTime = toy?.price > 12000
        ? toy.life_time/3
        : toy?.price < 5001
            ? 2
            : 3;
    return parseInt((toy.price / okkTime)/120);
}

export const getList = async (req, res) => {
    const {minAge, maxAge, categoryId} = req.query;

    const attributes = ["id", "name_ru", "name_kz", "description_ru", "description_kz", "max_age", "min_age", "photos", "price", "life_time"];
    let toys;

    if (maxAge || minAge || categoryId) {
        let whereObj = {};
        if (minAge) whereObj["max_age"] = {[Op.gte]: minAge}
        if (maxAge) whereObj["min_age"] = {[Op.lte]: maxAge}
        // if (categoryId) whereObj.categoryId = {""}
        toys = await models.Toy.findAll({
            attributes, where: whereObj
        });
    }
    else toys = await models.Toy.findAll({attributes});

    return res.status(200).json(createResponse(toys.map(t => ({
        id: t.id,
        name_ru: t.name_ru,
        name_kz: t.name_kz,
        description_ru: t.description_ru,
        description_kz: t.description_kz,
        max_age: t.max_age,
        min_age: t.min_age,
        photos: t.photos,
        token: getToken(t),
    }))));
}