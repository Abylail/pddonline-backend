import jwt from "jsonwebtoken";
import "dotenv/config"
import {createError} from "../../helpers/responser.js";

export default (req, res, next) => {
    const token = req.cookies.userToken;

    if (!token) return res.status(401).json(createError("Пользователь не авторизован"))

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        req.user = decoded;
        return next();
    } catch (e) {
        return res.status(401).json(createError("Пользователь не авторизован"))
    }
}