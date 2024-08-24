import { Express } from "express";
import { categoryRoutes } from "./category.route";
import { systemConfig } from "../../config/system";
import { tourRoutes } from "./tour.route";

const adminRoutes = (app: Express): void => {

  const path = `/${systemConfig.prefixAdmin}`;

  app.use(`${path}/categories`, categoryRoutes);
  app.use(`${path}/tours`, tourRoutes);
};

export default adminRoutes;