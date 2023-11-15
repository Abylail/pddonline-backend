import express from "express";

import onlyAdmin from "../middlewares/onlyAdmin.js";
import {getTrialRegistrations, setStatusTrialRegistrations} from "../controllers/trialRegistrations.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getTrialRegistrations)
    router.put("/setStatus", onlyAdmin, setStatusTrialRegistrations)

    return router;
}