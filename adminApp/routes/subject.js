import express from "express";
import onlyAdmin from "../middlewares/onlyAdmin.js";
import {
    getList,
    create,
    deleteSubject,
    bindSubjectCategory,
    getListByCategory,
    update
} from "../controllers/subject.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.get("/get/:category_code", getListByCategory);
    router.post("/create", onlyAdmin, create);
    router.put("/update/:code", onlyAdmin, update);
    router.post("/bind", onlyAdmin, bindSubjectCategory);
    router.delete("/delete/:code", onlyAdmin, deleteSubject);

    return router;
}