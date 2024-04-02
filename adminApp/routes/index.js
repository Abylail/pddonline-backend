import "dotenv/config";

import createUserRoutes from "./user.js";
import createUsersRoutes from "./users.js";
import createQuestionRoutes from "./question.js";

export default app => {
    const BaseUrl = "/api/v1/admin";

    app.use(`${BaseUrl}/user`, createUserRoutes(app))
    app.use(`${BaseUrl}/users`, createUsersRoutes(app))
    app.use(`${BaseUrl}/question`, createQuestionRoutes(app))
}