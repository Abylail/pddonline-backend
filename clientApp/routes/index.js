import "dotenv/config";

import createParentRoutes from "./parent.js";
import createCategoryRoutes from "./category.js";
import createSubjectRoutes from "./subject.js";
import createInstitutionSubjectRoutes from "./institutionSubject.js";
import createInstitutionRoutes from "./institution.js";

export default app => {
    const BaseUrl = "/api/v1/client";

    app.use(`${BaseUrl}/parent`, createParentRoutes(app))
    app.use(`${BaseUrl}/category`, createCategoryRoutes(app))
    app.use(`${BaseUrl}/subject`, createSubjectRoutes(app))
    app.use(`${BaseUrl}/institutionSubject`, createInstitutionSubjectRoutes(app))
    app.use(`${BaseUrl}/institution`, createInstitutionRoutes(app))
}