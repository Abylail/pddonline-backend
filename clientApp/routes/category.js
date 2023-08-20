import express from "express";
import {getInstitutionSubjects, getList, getSubjects} from "../controllers/category.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.get("/:categoryCode/getSubjects", getSubjects);
    router.get("/:categoryCode/getInstitutionSubjects", getInstitutionSubjects);

    return router;
}