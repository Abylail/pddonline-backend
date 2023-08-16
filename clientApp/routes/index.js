import "dotenv/config";

import createParentRoutes from "./parent.js";

export default app => {
    const BaseUrl = "/api/v1/client";

    app.use(`${BaseUrl}/parent`, createParentRoutes(app))
}