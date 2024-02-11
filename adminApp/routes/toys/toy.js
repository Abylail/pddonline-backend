import express from "express";
import onlyAdmin from "../../middlewares/onlyAdmin.js";
import {getList, createToy, updateToy, deleteToy, addPhoto, removePhoto} from "../../controllers/toys/toy.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.post("/create", onlyAdmin, createToy);
    router.put("/update/:id", onlyAdmin, updateToy);
    router.delete("/delete/:id", onlyAdmin, deleteToy);

    router.put("/uploadPhoto/:id", onlyAdmin, addPhoto);
    router.put("/deletePhoto/:id", onlyAdmin, removePhoto);

    return router;
}