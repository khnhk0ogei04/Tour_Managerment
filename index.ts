import express, {Express, Request ,Response} from "express";
import sequelize from "./config/database";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import Tour from "./models/tour.model";
import clientRoutes from "./routes/client/index.route";
dotenv.config();
sequelize;
// https://www.digitalocean.com/community/tutorials/how-to-use-sequelize-with-node-js-and-mysql
const app: Express = express();
const port: number | string = `${process.env.PORT}` || 3000;

app.set("views", "./views");
app.set("view engine", "pug");

app.use(express.static("public"));

app.use(bodyParser.json());
clientRoutes(app);
app.listen(port, () => {
    console.log(`App listen on port ${port}`);
})