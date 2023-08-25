import express from "express";
import {getTop} from "../controllers/intitution.js";


export default () => {
    const router = express.Router();

    router.get("/top", getTop);

    return router;
}