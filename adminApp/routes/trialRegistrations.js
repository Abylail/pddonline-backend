import express from "express";

import onlyAdmin from "../middlewares/onlyAdmin.js";
import {
    deleteTrialRegistration,
    getTrialRegistrations,
    setStatusTrialRegistrations
} from "../controllers/trialRegistrations.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getTrialRegistrations)
    router.put("/setStatus", onlyAdmin, setStatusTrialRegistrations)
    router.delete("/delete/:registration_id", onlyAdmin, deleteTrialRegistration)

    return router;
}