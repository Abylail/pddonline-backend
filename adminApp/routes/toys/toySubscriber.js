import express from "express";
import onlyAdmin from "../../middlewares/onlyAdmin.js";
import {
    createSubscriber,
    deleteSubscriber,
    getList,
    getOne,
    updateSubscriber
} from "../../controllers/toys/toySubscriber.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.get("/get/:id", getOne);
    router.post("/create", createSubscriber);
    router.put("/update/:id", updateSubscriber);
    router.delete("/delete/:id", deleteSubscriber);

    return router;
}