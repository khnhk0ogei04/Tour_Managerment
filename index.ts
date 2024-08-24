import express, {Express, Request ,Response} from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Tour from "./models/tour.model";
import adminRoutes from "./routes/admin/index.route";
import clientRoutes from "./routes/client/index.route";
import { systemConfig } from "./config/system";
import path from "path";
dotenv.config();
sequelize;
// https://www.digitalocean.com/community/tutorials/how-to-use-sequelize-with-node-js-and-mysql
const app: Express = express();
const port: number | string = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: false}))

app.use(bodyParser.json());
app.locals.prefixAdmin = systemConfig.prefixAdmin;

// TinyMCE
app.use(
    "/tinymce",
    express.static(path.join(__dirname, "node_modules", "tinymce"))
  );
  // End TinyMCE
adminRoutes(app);
clientRoutes(app);
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})