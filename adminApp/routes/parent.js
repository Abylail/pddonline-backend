import express from "express";

import onlyAdmin from "../middlewares/onlyAdmin.js";
import {getList} from "../controllers/parent.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getList)

    return router;
}