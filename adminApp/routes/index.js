import "dotenv/config";

import createUserRoutes from "./user.js";

export default app => {
    const BaseUrl = "/api/v1/admin";

    app.use(`${BaseUrl}/user`, createUserRoutes(app))
}