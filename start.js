import models, { sequelize } from "./models/index.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import "dotenv/config";

import createAdminRouter from "./adminApp/routes/index.js"
import createClientRouter from "./clientApp/routes/index.js"

export default () => {
    const app = express();

    app.use(express.json({
        limit: '500mb'
    }));
    app.use(express.urlencoded({
        extended: true,
        limit: '500mb'
    }));
    app.use(cors({
        origin: ['http://localhost:3000'],
        credentials: true,
        methods: "GET, POST, PUT, DELETE",
    }))
    app.use(cookieParser())

    sequelize.sync({
        force: false,
        logging: false
    }).then(() => {
        createAdminRouter(app);
        createClientRouter(app);
    })

    app.listen(3333, () => {
        console.log("Server listen to port 3333")
    })
}