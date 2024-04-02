import express from "express";
import auth from "../middlewares/auth.js";
import {createQuestion, deleteQuestion, getList, getOne, updateQuestion} from "../controllers/question.js";

export default () => {
    const router = express.Router();

    router.get("/getList", auth, getList)
    router.get("/get/:id", auth, getOne)
    router.post("/create", auth, createQuestion)
    router.put("/update/:id", auth, updateQuestion)
    router.delete("/delete/:id", auth, deleteQuestion)

    return router;
}