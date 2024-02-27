import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import {removeFile, uploadFile} from "../../../services/image.js";

export const getList = async (req, res) => {
    const toys = await models.Toy.findAll({
        order: [['createdAt', 'DESC']],
        include: [
            {model: models.ToyCategory, through: {attributes: []}, as: "categories", attributes: ["id", "name_ru","name_kz", "code"]}
        ]
    },);
    res.status(200).json(createResponse(toys));
}

export const getOne = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findOne({
        where: {id},
        include: [
            {model: models.ToyCategory, through: {attributes: []}, as: "categories", attributes: ["id", "name_ru","name_kz", "code"]}
        ]
    });
    res.status(200).json(createResponse(toy));
}

export const createToy = async (req, res) => {
    const {name_ru, name_kz, description_ru, description_kz, purpose_ru, purpose_kz, material_ru, material_kz, size_ru, size_kz, max_age, min_age, kaspiUrl, price, life_time} = req.body;

    try {
        await models.Toy.create({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, life_time, purpose_ru, purpose_kz, material_ru, material_kz, size_ru, size_kz});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    res.status(200).json(createResponse({status: "OK"}));
}

export const updateToy = async (req, res) => {
    const {id} = req.params;
    const {name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time, categories, purpose_ru, purpose_kz, material_ru, material_kz, size_ru, size_kz,} = req.body;

    try {
        await models.Toy.update({name_ru, name_kz, description_ru, description_kz, max_age, min_age, kaspiUrl, price, photos, life_time, purpose_ru, purpose_kz, material_ru, material_kz, size_ru, size_kz,}, {where: {id}});
    } catch (e) {
        res.status(500).json(createError("Не могу создать"));
    }

    const toy = await models.Toy.findOne({where: {id}, include: [
            {model: models.ToyCategory, through: {attributes: []}, as: "categories", attributes: ["id", "name_ru","name_kz", "code"]}
        ]});

    const newCategoryIds = categories.map(({id}) => id);
    const oldCategoryIds = toy.dataValues.categories.map(({id}) => id);

    // Связывание
    try {
        if (Array.isArray(newCategoryIds) && JSON.stringify(newCategoryIds) !== JSON.stringify(oldCategoryIds)) {

            // Добавляю новые
            const categoriesForAdd = newCategoryIds.filter(categoryId => !oldCategoryIds.includes(categoryId));
            const addCategoriesModels = await Promise.all(categoriesForAdd.map(categoryId => models.ToyCategory.findOne({where: {id: categoryId}})));
            await Promise.all(addCategoriesModels.map(categoryModel => categoryModel.addToy(toy.dataValues.id)))

            // Убираю категории
            const categoriesForDelete = oldCategoryIds.filter(categoryId => !newCategoryIds.includes(categoryId));
            const deleteCategoriesModels = await Promise.all(categoriesForDelete.map(categoryId => models.ToyCategory.findOne({where: {id: categoryId}})));
            await Promise.all(deleteCategoriesModels.map(categoryModel => categoryModel.removeToy(toy.dataValues.id)))
        }
    } catch (e) {
        return res.status(500).json(createError("Не могу связать"))
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

// Добавть картинку
export const addPhoto = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findOne({where: {id}});
    if (!toy) return res.status(500).json(createError("Игрушка не найдена"));

    // Массив фоток
    let photos = toy.dataValues.photos || [];

    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "toy");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));
    photos.push(filePath);

    try {
        // Сохранение в базе новой картинки
        await models.Toy.update(
            {photos},
            {where: {id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}

// Удалить картинку
export const removePhoto = async (req, res) => {
    const {id} = req.params;
    const toy = await models.Toy.findOne({where: {id}});
    if (!toy) return res.status(500).json(createError("Игрушка не найдена"));

    const {imagePath} = req.body;
    if (!imagePath) return res.status(500).json(createError("Нет ссылки на картинку"));

    let photos = toy.dataValues.photos || [];
    const photoIndex = photos.indexOf(imagePath);
    if (photoIndex > -1) {
        await removeFile(imagePath);
        photos.splice(photoIndex, 1);
    }

    try {
        // Сохранение в базе новой картинки
        await models.Toy.update(
            {photos},
            {where: {id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить"))
    }

    res.status(200).json({status: "OK", photos})
}