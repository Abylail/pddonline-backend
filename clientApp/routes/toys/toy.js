import express from "express";
import {getList, getOne} from "../../controllers/toy/toy.js";
import {getList as getCategories} from "../../controllers/toy/toyСategory.js";
import {parentRequestToySubscribe} from "../../controllers/toy/toySubscribeRequest.js";
import parentAuth from "../../middlewares/parentAuth.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);
    router.get("/get/:id", getOne);
    router.get("/getCategories", getCategories);

    router.post("/subscribeRequest", parentAuth, parentRequestToySubscribe);

    return router;
}