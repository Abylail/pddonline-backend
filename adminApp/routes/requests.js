import express from "express";
import onlyAdmin from "../middlewares/onlyAdmin.js";
import {getRequests, updateRequest, deleteRequest} from "../controllers/request.js";

export default () => {
    const router = express.Router();

    router.get("/get", onlyAdmin, getRequests)
    router.put("/update/:request_id" ,onlyAdmin, updateRequest)
    router.delete("/delete/:request_id", onlyAdmin, deleteRequest)

    return router;
}