import express from "express";
import {searchBranches, searchCenters, searchLessons} from "../controllers/search.js";

export default () => {
    const router = express.Router();

    router.get("/lessons", searchLessons);
    router.get("/centers", searchCenters);
    router.get("/branches", searchBranches);

    return router;
}