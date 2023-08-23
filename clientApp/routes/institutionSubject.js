import express from "express";
import {getFeed} from "../controllers/institutionSubject.js";

export default () => {
    const router = express.Router();

    router.get("/feed", getFeed);

    return router;
}