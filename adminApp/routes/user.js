import express from "express";

import {login, tokenAuth, update} from "../controllers/user.js";
import auth from "../middlewares/auth.js";

export default () => {
    const router = express.Router();

    router.get("/login/token", auth, tokenAuth)
    router.post("/login", login)
    router.put("/update", auth, update)

    return router;
}