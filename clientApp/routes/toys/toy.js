import express from "express";
import {getList} from "../../controllers/toy/toy.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);

    return router;
}