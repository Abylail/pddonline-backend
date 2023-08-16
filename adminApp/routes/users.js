import express from "express";
import {getList, bindRole, deleteUser} from "../controllers/users.js";
import onlyAdmin from "../middlewares/onlyAdmin.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getList)
    router.delete("/delete/:id", onlyAdmin, deleteUser)
    router.post("/bind", onlyAdmin ,bindRole)

    return router;
}