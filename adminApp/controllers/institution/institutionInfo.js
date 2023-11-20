import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";
import translit from "../../helpers/translit.js";
import generateRandomHash from "../../../helpers/generateRandomHash.js";
import {removeFile, uploadFile} from "../../../services/image.js";
import {generateToken} from "../../../helpers/generateAccessToken.js";

export const getList = async (req, res) => {
    const institutions = await models.Institution.findAll({
        include: [
            {model: models.User, as: "director", attributes: ["id", "first_name", "last_name", "phone"]}
        ]
    });
    return res.status(200).json(createResponse(institutions));
}

// Зайти под учреждением
export const enterAsInstitution = async (req, res) => {
    const {institution_id} = req.params;
    const institution = await models.Institution.findByPk(institution_id);
    if (!institution) return res.status(404).json(createError("Учреждение не найденно"))

    const director = await models.User.findOne({
        where: {institution_id},
        include: [
            {model: models.Role, as: "role", attributes: ["title", "code"]}
        ],
    });
    if (!director) return res.status(404).json(createError("Директор не найден"))

    const token = generateToken({id: director.id, role_code: director.role?.code, institution_id: director.institution_id});

    return res.status(200).json(createResponse(token));
}

export const getById = async (req, res) => {
    const {institution_id} = req.params;
    const institutions = await models.Institution.findByPk(institution_id);
    return res.status(200).json(createResponse(institutions));
}

export const create = async (req, res) => {
    const {name, start_time, end_time, type, director_id, call_phone, whatsapp_phone, email, instagram_url, description} = req.body;
    const code = translit(name) + `-${generateRandomHash()}`;

    let createdInstitution
    try {
        createdInstitution = await models.Institution.create({
            name, code, start_time, end_time, type, director_id, call_phone, whatsapp_phone, email, instagram_url, description
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"))
    }

    try {
        if (director_id) {
            const director = await models.User.findByPk(director_id);
            if (director) await createdInstitution.setDirector(director);
        }
    } catch (e) {
        return res.status(500).json(createError("Не могу привязать директора"))
    }

    const newInstitution = await models.Institution.findByPk(createdInstitution.id, {
        include: [
            {model: models.User, as: "director", attributes: ["id", "first_name", "last_name", "phone"]}
        ]
    });

    return res.status(200).json(createResponse(newInstitution))
}

export const update = async (req, res) => {
    const {institution_id} = req.params;
    const {name, description, start_time, end_time, type, director_id, call_phone, whatsapp_phone, email, instagram_url} = req.body;

    if (!institution_id) return res.status(500).json(createError("Нет id"));

    try {
        const oldInstitution = await models.Institution.findByPk(institution_id);
        if (oldInstitution.director_id !== director_id) {
            const director = await models.User.findByPk(director_id);
            if (director) await oldInstitution.setDirector(director);
            else await oldInstitution.setDirector(null);
        }
    } catch (e) {
        return res.status(500).json(createError("Не могу привязать директора"))
    }

    try {
        await models.Institution.update(
            {name, description, start_time, end_time, type, institution_id, call_phone, whatsapp_phone, email, instagram_url},
            {where: {id: institution_id}}
        )
    } catch (e) {
        return res.status(500).json(createError("Не могу создать"))
    }

    const newInstitution = await models.Institution.findByPk(institution_id, {
        include: [
            {model: models.User, as: "director", attributes: ["id", "first_name", "last_name", "phone"]}
        ]
    });

    return res.status(200).json(createResponse(newInstitution))
}

export const deleteInstitution = async (req, res) => {
    const {institution_id} = req.params;

    try {
        await models.Institution.destroy({where: {id: institution_id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу удалить"))
    }

    return res.status(200).json({status: "OK"})
}

export const uploadLogo = async (req, res) => {
    const {institution_id} = req.params;
    const institution = await models.Institution.findByPk(institution_id);
    if (!institution_id || !institution) return res.status(500).json(createError("Центр не найден"));

    // Удаляю старую картинку
    if (typeof institution.dataValues.logo === "string") await removeFile(institution.dataValues.logo)

    // Загружаю новую фотку
    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "institution");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));

    try {
        // Сохранение в базе новой картинки
        await models.Institution.update(
            {logo: filePath},
            {where: {id: institution_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}

export const addPhoto = async (req, res) => {
    const {institution_id} = req.params;
    const institution = await models.Institution.findByPk(institution_id);
    if (!institution_id || !institution) return res.status(500).json(createError("Центр не найден"));

    // Массив фоток
    let photos = institution.dataValues.photos || [];

    const {buffer} = req.body;
    const filePath = await uploadFile(buffer, "institution");
    if (!filePath) return res.status(500).json(createError("Не удалось загрузить файл"));
    photos.push(filePath);

    try {
        // Сохранение в базе новой картинки
        await models.Institution.update(
            {photos},
            {where: {id: institution_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить файл"))
    }

    res.status(200).json({status: "OK"})
}

export const removePhoto = async (req, res) => {
    const {institution_id} = req.params;
    const institution = await models.Institution.findByPk(institution_id);
    if (!institution_id || !institution) return res.status(500).json(createError("Центр не найден"));

    const {imagePath} = req.body;
    if (!imagePath) return res.status(500).json(createError("Нет ссылки на картинку"));

    let photos = institution.dataValues.photos || [];
    const photoIndex = photos.indexOf(imagePath);
    if (photoIndex > -1) {
        await removeFile(imagePath);
        photos.splice(photoIndex, 1);
    }

    try {
        // Сохранение в базе новой картинки
        await models.Institution.update(
            {photos},
            {where: {id: institution_id}}
        );
    } catch (e) {
        return res.status(500).json(createError("Не удалось сохранить"))
    }

    res.status(200).json({status: "OK", photos})
}
