import express from "express";
import {getFeed, getSubjectDetails} from "../controllers/institutionSubject.js";

export default () => {
    const router = express.Router();

    router.get("/feed", getFeed);
    router.get("/details/:id", getSubjectDetails);

    return router;
}