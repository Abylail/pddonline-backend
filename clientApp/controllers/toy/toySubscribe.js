import models from "../../../models/index.js";
import {createError, createResponse} from "../../../helpers/responser.js";

export const getSubscribe = async (req, res) => {
    const parentId = req.parentId;
    const user = await models.Parent.findByPk(parentId, {attributes: ["phone"]})
    if (!user) return res.status(404).json(createError("Пользователь не найден"))
    const subscribe = await models.ToySubscriber.findOne({
        where: {phone: user.dataValues.phone},
        attributes: ["rate", "tokens", "startSubscription", "endSubscription", "activeToys", "status"],
    });
    res.status(200).json(createResponse(subscribe));
}