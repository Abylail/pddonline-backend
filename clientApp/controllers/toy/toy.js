import {createResponse} from "../../../helpers/responser.js";
import models from "../../../models/index.js";

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
    const toys = await models.Toy.findAll({
        attributes: ["name_ru", "name_kz", "description_ru", "description_kz", "max_age", "min_age", "photos", "price", "life_time"]
    });

    return res.status(200).json(createResponse(toys.map(t => ({
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