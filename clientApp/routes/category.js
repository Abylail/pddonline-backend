import express from "express";
import {getList} from "../controllers/category.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);

    return router;
}