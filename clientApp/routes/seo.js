import express from "express";
import {seoOptions} from "../controllers/seo.js";

export default () => {
    const router = express.Router();

    router.get("/options", seoOptions);

    return router;
}