import express from "express";
import onlyAdmin from "../middlewares/onlyAdmin.js";
import {getList, create, deleteCategory, bindCategorySubject, update} from "../controllers/category.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.post("/create", onlyAdmin, create);
    router.put("/update/:code", onlyAdmin, update);
    router.post("/bind", onlyAdmin, bindCategorySubject);
    router.delete("/delete/:code", onlyAdmin, deleteCategory);

    return router;
}