import express from "express";
import {phoneSmsAuth, sendSms, tokenAuth} from "../controllers/parent.js";
import parentAuth from "../middlewares/parentAuth.js";

export default () => {
    const router = express.Router();

    router.post("/sendSms", sendSms);
    router.post("/smsAuth", phoneSmsAuth);
    router.get("/tokenAuth", parentAuth, tokenAuth);

    return router;
}