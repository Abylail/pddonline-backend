import express from "express";
import {getList} from "../../controllers/toy/toy.js";
import {parentRequestToySubscribe} from "../../controllers/toy/toySubscribeRequest.js";
import parentAuth from "../../middlewares/parentAuth.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);

    router.post("/subscribeRequest", parentAuth, parentRequestToySubscribe);

    return router;
}