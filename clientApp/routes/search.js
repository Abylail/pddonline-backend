import express from "express";
import {searchLessons} from "../controllers/search.js";

export default () => {
    const router = express.Router();

    router.get("/lessons", searchLessons);

    return router;
}