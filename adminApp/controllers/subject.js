import models from "../../models/index.js";
import translit from "../helpers/translit.js";
import {createError, createResponse} from "../../helpers/responser.js";
import {Op, where, fn, col} from "sequelize";

export const getList = async (req, res) => {
    // Поиск
    const {query} = req.query;
    const queryObject = query ? {name: {[Op.like]: `%${query}%`}} : {};

    let subjects = [];

    try {
        subjects = await models.Subject.findAll({
            where: {
                ...queryObject
            },
            include: {
                model: models.Category,
                as: "categories",
                attributes: ["code", "name"],
                through: {attributes: []}
            }
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json(createError("Не могу получить список"))
    }

    res.status(200).json(createResponse(subjects))
}

export const getListByCategory = async (req, res) => {
    const {category_code} = req.params;

    // Поиск
    const {query} = req.query;
    const queryObject = query ? {name: {[Op.like]: `%${query}%`}} : {};

    const category = await models.Category.findOne({where: {code: category_code}})

    if (!category) return res.status(404).json(createError("Категория не найдена"));

    let subjects = [];

    try {
        let subjectModels = await category.getSubjects({
            attributes: ["id"],
            joinTableAttributes: [],
        })

        const subjectIds = subjectModels.map(({dataValues}) => dataValues.id);

        subjects = await models.Subject.findAll({
            where: {id: subjectIds, ...queryObject},
            include: {
                model: models.Category,
                as: "categories",
                attributes: ["code", "name"],
                through: {attributes: []}
            }
        });
    } catch (e) {
        return res.status(500).json(createError("Не могу получить список"))
    }

    res.status(200).json(createResponse(subjects))
}

export const create = async (req, res) => {
    const {name, color, is_sport, categories} = req.body;

    if (!name) return res.status(500).json(createError("Нет имени"))

    let newSubject
    try {
        const code = translit(name)
        newSubject = await models.Subject.create({name, code, color, is_sport})
    } catch (e) {
        return res.status(500).json(createError("Не могу создать предмет"))
    }

    try {
        if (Array.isArray(categories) && categories.length > 0) {
            const categoriesModels = await Promise.all(categories.map(category_code => models.Category.findOne({where: {code: category_code}})));
            await Promise.all(categoriesModels.map(categoryModel => categoryModel.addSubject(newSubject.id)))
        }
    } catch (e) {
        return res.status(500).json(createError("Не могу связать предмет"))
    }

    return res.status(200).json(createResponse(newSubject))
}

export const update = async (req, res) => {
    const {name, color, is_sport, categories} = req.body;
    const {code} = req.params;

    if (!code) return res.status(500).json(createError("Нет кода"))

    const oldSubject = await models.Subject.findOne({
        where: {code},
        include: {
            model: models.Category,
            as: "categories",
            attributes: ["code", "name"],
            through: {attributes: []}
        }})

    if (!oldSubject) return res.status(404).json(createError("Предмет не найден"))

    let newSubject
    try {
        newSubject = await models.Subject.update({
            name: name || oldSubject.dataValues.name,
            color: color || oldSubject.dataValues.color,
            is_sport: is_sport || oldSubject.dataValues.is_sport,
        }, {where: {code}})
    } catch (e) {
        return res.status(500).json(createError("Не могу создать предмет"))
    }

    // Связывание
    try {
        if (Array.isArray(categories) && categories.length > 0 && JSON.stringify(categories) !== JSON.stringify(oldSubject.categories)) {
            const oldCategories = (oldSubject.categories || []).map(({code}) => code);

            // Добавляю новые
            const categoriesForAdd = categories.filter(category => !oldCategories.includes(category));
            const addategoriesModels = await Promise.all(categoriesForAdd.map(category_code => models.Category.findOne({where: {code: category_code}})));
            await Promise.all(addategoriesModels.map(categoryModel => categoryModel.addSubject(oldSubject.id)))

            // Убираю категории
            const categoriesForDelete = oldCategories.filter(category => !categories.includes(category));
            const deleteCategoriesModels = await Promise.all(categoriesForDelete.map(category_code => models.Category.findOne({where: {code: category_code}})));
            await Promise.all(deleteCategoriesModels.map(categoryModel => categoryModel.removeSubject(oldSubject.id)))
        }
    } catch (e) {
        return res.status(500).json(createError("Не могу связать предмет"))
    }

    return res.status(200).json({status: "OK"})
}

export const deleteSubject = async (req, res) => {
    const {code} = req.params;

    if (!code) return res.status(500).json(createError("Нет кода"));

    try {
        await models.Subject.destroy({where: {code}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"));
    }

    return res.status(200).json({status: "OK"})
}

export const bindSubjectCategory = async (req, res) => {
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