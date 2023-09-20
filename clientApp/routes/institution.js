import express from "express";
import {getInstitutionDetails, getTop} from "../controllers/intitution.js";


export default () => {
    const router = express.Router();

    router.get("/top", getTop);
    router.get("/details/:id", getInstitutionDetails);

    return router;
}