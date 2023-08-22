import express from "express";
import {getList} from "../controllers/subject.js";

export default () => {
    const router = express.Router();

    router.get("/get", getList);

    return router;
}