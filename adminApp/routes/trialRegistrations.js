import express from "express";

import onlyAdmin from "../middlewares/onlyAdmin.js";
import {
    deleteTrialRegistration,
    getTrialRegistrations,
    setStatusTrialRegistrations, updateTrialRegistrations
} from "../controllers/trialRegistrations.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getTrialRegistrations)
    router.put("/setStatus", onlyAdmin, setStatusTrialRegistrations)
    router.put("/update/:registration_id", onlyAdmin, updateTrialRegistrations)
    router.delete("/delete/:registration_id", onlyAdmin, deleteTrialRegistration)

    return router;
}