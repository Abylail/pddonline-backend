import "dotenv/config";

import createParentRoutes from "./parent.js";
import createCategoryRoutes from "./category.js";

export default app => {
    const BaseUrl = "/api/v1/client";

    app.use(`${BaseUrl}/parent`, createParentRoutes(app))
    app.use(`${BaseUrl}/category`, createCategoryRoutes(app))
}