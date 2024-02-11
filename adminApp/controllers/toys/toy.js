import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const roles = await models.Toy.findAll();
    res.status(200).json(createResponse(roles));
}

export const createToy = async (req, res) => {
    const {name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, life_time} = req.body;

    try {
        await models.Toy.create({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, life_time});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const updateToy = async (req, res) => {
    const {id} = req.params;
    const {name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time} = req.body;

    try {
        await models.Toy.update({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time}, {where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const deleteToy = async (req, res) => {
    const {id} = req.params;

    try {
        await models.Toy.destroy({where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу удалить"));
    }

    res.status(200).json({status: "OK"})
}