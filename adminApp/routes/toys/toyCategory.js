import express from "express";
import onlyAdmin from "../../middlewares/onlyAdmin.js";
import {getList, create, deleteCategory, update} from "../../controllers/toys/toyСategory.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.post("/create", onlyAdmin, create);
    router.put("/update/:id", onlyAdmin, update);
    router.delete("/delete/:id", onlyAdmin, deleteCategory);

    return router;
}