import { Router, Express } from "express";
const router: Router = Router();
import * as controller from "../../controllers/client/homePage.controller";
router.get("/", controller.index);
export const homePageRoutes: Router = router;