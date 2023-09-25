import express from "express";
import {searchCenters, searchLessons} from "../controllers/search.js";

export default () => {
    const router = express.Router();

    router.get("/lessons", searchLessons);
    router.get("/centers", searchCenters);

    return router;
}