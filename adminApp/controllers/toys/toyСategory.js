import models from "../../../models/index.js";
import translit from "../../helpers/translit.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getList = async (req, res) => {
    const categories = await models.ToyCategory.findAll();
    res.status(200).json(createResponse(categories));
}

export const create = async (req, res) => {
    const {name_ru, name_kz, icon_mdi} = req.body;

    if (!name_ru || !name_kz) return res.status(500).json(createError("Нет имени"))

    const same = await models.ToyCategory.findOne({where: {name_ru}});
    if (same) return res.status(500).json(createError("Уже есть такая категория"))

    let newCategory
    try {
        const code = translit(name_ru)
        newCategory = await models.ToyCategory.create({
            name_ru, name_kz,
            code,
            icon_mdi,
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать категорию"))
    }

    return res.status(200).json(createResponse(newCategory))
}

export const update = async (req, res) => {
    const {id} = req.params;
    const {icon_mdi, name_ru, name_kz} = req.body;

    if (!id) return res.status(500).json(createError("Нет id"))

    try {
        await models.ToyCategory.update({icon_mdi, name_ru, name_kz}, {where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу создать категорию"))
    }

    const updatedCategory = await models.ToyCategory.findOne({where: {id}});

    return res.status(200).json(createResponse(updatedCategory))
}

export const deleteCategory = async (req, res) => {
    const {id} = req.params;

    if (!id) return res.status(500).json(createError("Нет id"));

    try {
        await models.ToyCategory.destroy({where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"})
}