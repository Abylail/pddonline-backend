import models from "../../models/index.js";
import {createError, createResponse} from "../../helpers/responser.js";

export const getList = async (req, res) => {
    const query = req.query;

    const users = await models.User.findAll({where: query});

    res.status(200).json(createResponse(users));
}

export const createUser = async (req, res) => {
    const {first_name, last_name, phone, password} = req.body;

    const user = await models.User.findOne({ where: { phone } })

    if (user) return res.status(500).json(createError("Пользователь существует"));

    try {
        await models.User.create({
            first_name,
            last_name,
            phone,
            password,
        })
    } catch (e) {
        return res.status(500).json(createError("Не могу создать пользователя"));
    }

    const newUser = await models.User.findOne({
        where: { phone },
        attributes: {exclude: ["updatedAt", "createdAt", "password"]}
    });

    res.status(200).json(createResponse(newUser));
}

export const deleteUser = async (req, res) => {
    const {id} = req.params;

    try {
        await models.User.destroy({where: {id}})
    } catch (e) {
        res.status(500).json(createError("Удалить пользователя"));
    }

    res.status(200).json({ status: "OK" });
}

export const bindRole = async (req, res) => {
    const {user_id, role_id} = req.body;
    if (!user_id || !role_id) return res.status(500).json(createError("Нет пользователя или роли"))

    const [user, role] = await Promise.all([models.User.findByPk(user_id), models.Role.findByPk(role_id)]);
    if (!user || !role) return res.status(500).json(createError("Нет пользователя или роли"))

    try {
        await user.setRole(role);
    } catch (e) {
        return res.status(500).json(createError("Не могу привязать"))
    }

    res.status(200).json({status: "OK"});

}