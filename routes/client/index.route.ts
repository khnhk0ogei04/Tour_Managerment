import { Express } from "express";
import { tourRoutes } from "./tour.route";
import { categoryRoutes } from "./category.route";
import { homePageRoutes } from "./homePage.route";
import { cartRoutes } from "./cart.route";
import { orderRoutes } from "./order.route";
const clientRoutes = (app: Express): void => {
    app.use("/", homePageRoutes)
    app.use("/categories", categoryRoutes);
    app.use("/tours", tourRoutes);
    app.use("/cart", cartRoutes);
    app.use(`/order`, orderRoutes);
}
export default clientRoutes;