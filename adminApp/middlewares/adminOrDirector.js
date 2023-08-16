import jwt from "jsonwebtoken";
import "dotenv/config"
import {createError} from "../../helpers/responser.js";

export default (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json(createError("Пользователь не авторизован"))

    try {
        const decoded = jwt.verify(token, process.env.SECRET);

        if (decoded.role_code !== "admin" && decoded.institution_id !== +req.params.institution_id) return res.status(403).json(createError("Не достаточно прав"))
        req.user = decoded;
        return next();
    } catch (e) {
        return res.status(401).json(createError("Пользователь не авторизован"))
    }
}