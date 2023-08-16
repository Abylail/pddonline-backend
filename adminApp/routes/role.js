import express from "express";
import {createRole, deleteRole, getList} from "../controllers/role.js";
import onlyAdmin from "../middlewares/onlyAdmin.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getList)
    router.post("/create" ,onlyAdmin, createRole)
    router.delete("/delete/:code", onlyAdmin, deleteRole)

    return router;
}