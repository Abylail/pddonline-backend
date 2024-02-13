import express from "express";
import onlyAdmin from "../../middlewares/onlyAdmin.js";
import {getList, updateStatus} from "../../controllers/toys/toysSubscribeRequest.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getList);
    router.put("/updateStatus/:request_id", onlyAdmin, updateStatus);

    return router;
}