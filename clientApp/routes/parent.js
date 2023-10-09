import express from "express";
import {phoneSmsAuth, sendSms, tokenAuth} from "../controllers/parent/auth.js";
import parentAuth from "../middlewares/parentAuth.js";
import {addChildren, getChildren, updateChildren, updateInfo, deleteChildren} from "../controllers/parent/data.js";
import {registerActiveTrialList, registerTrial} from "../controllers/parent/trialRegistration.js";

export default () => {
    const router = express.Router();

    router.post("/sendSms", sendSms);
    router.post("/smsAuth", phoneSmsAuth);
    router.get("/tokenAuth", parentAuth, tokenAuth);


    router.put("/data/update", parentAuth, updateInfo);
    router.get("/data/children/get", parentAuth, getChildren);
    router.post("/data/children/add", parentAuth, addChildren);
    router.put("/data/children/update", parentAuth, updateChildren);
    router.delete("/data/children/delete/:id", parentAuth, deleteChildren);

    router.post("/register/trial", parentAuth, registerTrial)
    router.get("/register/trial/activelist", parentAuth, registerActiveTrialList)

    return router;
}