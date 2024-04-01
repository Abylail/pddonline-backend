import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";
import {generateToken} from "../../helpers/generateAccessToken.js";

const generateAccessToken = (user_id) => {
    return jwt.sign({ id: user_id },  process.env.SECRET, { expiresIn: '24h' });
};

export const login = async (req, res) => {
    const {phone, password} = req.body;
    const user = await models.User.findOne({
        where: { phone },
        attributes: {exclude: ["updatedAt", "createdAt"]}
    });

    if (!user) return res.status(404).json(createError("Пользователь не найден"))

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) return res.status(500).json(createError("Неверный логин или пароль"))

    const token = generateToken({id: user.id}) || generateAccessToken(user.id);

    res.status(200).json(createResponse({...user.dataValues, password: undefined, token} ));
}

export const tokenAuth = async (req, res) => {
    const { id } = req.user;
    const user = await models.User.findOne({
        where: { id },
        attributes: {exclude: ["updatedAt", "createdAt", "id", "password"]},
    });

    if (!user) return res.status(401).json(createError("Пользователь не авторизован"));

    res.status(200).json(createResponse(user));
}

export const update = async (req, res) => {
    const { id } = req.user;
    const oldUser = await models.User.findOne({
        where: { id },
        attributes: {exclude: ["updatedAt", "createdAt", "id", "password"]}
    });

    const updateData = req.body;
    const dataForUpdate = {
        first_name: updateData.first_name || oldUser.dataValues.first_name,
        last_name: updateData.last_name || oldUser.dataValues.last_name,
    }
    try {
        await models.User.update(dataForUpdate, {where: {id}})
    } catch (e) {
        return res.status(500).json(createError("Не могу обновить пользователя"))
    }

    res.status(200).json(createResponse({...oldUser.dataValues, ...dataForUpdate}));
}
