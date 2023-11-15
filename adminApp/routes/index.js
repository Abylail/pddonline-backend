import "dotenv/config";

import getUserRoutes from "./user.js";
import getUsersRoutes from "./users.js";
import getRolesRoutes from "./role.js";
import getCategoryRoutes from "./category.js";
import getSubjectRoutes from "./subject.js";
import getParentRoutes from "./parent.js";
import getInstitutionRoutes from "./institution.js";
import getTrialRegistrationsRoutes from "./trialRegistrations.js";

export default app => {
    const BaseUrl = "/api/v1/admin";

    app.use(`${BaseUrl}/user`, getUserRoutes(app))
    app.use(`${BaseUrl}/users`, getUsersRoutes(app))
    app.use(`${BaseUrl}/role`, getRolesRoutes(app))
    app.use(`${BaseUrl}/category`, getCategoryRoutes(app))
    app.use(`${BaseUrl}/subject`, getSubjectRoutes(app))
    app.use(`${BaseUrl}/parent`, getParentRoutes(app))
    app.use(`${BaseUrl}/institution`, getInstitutionRoutes(app))
    app.use(`${BaseUrl}/trialregistrations`, getTrialRegistrationsRoutes(app))
}