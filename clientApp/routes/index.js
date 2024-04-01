import "dotenv/config";

import cache from "../middlewares/cache.js";

export default app => {
    const BaseUrl = "/api/v1/client";

    // app.use(`${BaseUrl}/parent`, createParentRoutes(app))
    // app.use(`${BaseUrl}/category`, cache(6), createCategoryRoutes(app))
    // app.use(`${BaseUrl}/subject`, cache(6), createSubjectRoutes(app))
    // app.use(`${BaseUrl}/institutionSubject`, cache(6),createInstitutionSubjectRoutes(app))
    // app.use(`${BaseUrl}/institution`, cache(6), createInstitutionRoutes(app))
    // app.use(`${BaseUrl}/search`, cache(6),createSearchRoutes(app))
    // app.use(`${BaseUrl}/seo`, cache(6), createSeoRoutes(app))
    // app.use(`${BaseUrl}/toy`, cache(0.08), createToyRoutes(app))
}