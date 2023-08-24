import models from "../../models/index.js";
import translit from "../helpers/translit.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getList = async (req, res) => {
    const categories = await models.Category.findAll();
    res.status(200).json(createResponse(categories));
}

export const create = async (req, res) => {
    const {name, icon_mdi} = req.body;

    if (!name) return res.status(500).json(createError("Нет имени"))
    if (!icon_mdi) return res.status(500).json(createError("Нет иконки"))

    let newCategory
    try {
        const code = translit(name)
        newCategory = await models.Category.create({
            name,
            code,
            icon_mdi,
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать категорию"))
    }

    return res.status(200).json(createResponse(newCategory))
}

export const update = async (req, res) => {
    const {code} = req.params;
    const {icon_mdi} = req.body;

    if (!code) return res.status(500).json(createError("Нет кода"))
    if (!icon_mdi) return res.status(500).json(createError("Нет иконки"))

    try {
        await models.Category.update({icon_mdi}, {where: {code}})
    } catch (e) {
        return res.status(500).json(createError("Не могу создать категорию"))
    }

    const updatedCategory = await models.Category.findOne({where: {code}});

    return res.status(200).json(createResponse(updatedCategory))
}

export const deleteCategory = async (req, res) => {
    const {code} = req.params;

    if (!code) return res.status(500).json(createError("Нет кода"));

    try {
        await models.Category.destroy({where: {code}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"})
}

export const bindCategorySubject = async (req, res) => {
    const {category_id, subject_id} = req.body;

    if (!category_id || !subject_id) return res.status(500).json(createError("Отсутвуют параметры"));

    try {
        const [subject, category] = await Promise.all([models.Subject.findByPk(subject_id), models.Category.findByPk(category_id)]);

        if (!category || !subject) return res.status(500).json(createError("Не существуюшие объекты"));

        subject.addCategory(category);
    } catch (e) {
        return res.status(500).json(createError("Не связать"));
    }

    return res.status(200).json({status: "OK"})
}