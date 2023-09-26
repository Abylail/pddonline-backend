import express from "express";
import {getInstitutionDetails, getInstitutionSubjects, getTop} from "../controllers/intitution.js";


export default () => {
    const router = express.Router();

    router.get("/top", getTop);
    router.get("/details/:id", getInstitutionDetails);
    router.get("/details/:id/subjects", getInstitutionSubjects);

    return router;
}