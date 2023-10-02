import express from "express";
import handlebars from "express-handlebars";
import { connectDB } from "./mongo/mongo.js";
import { config } from "../config/config.js";
import __dirname from "../dirname.js";
import bodyParser from "body-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import auth from "../utils/auth.js";
import passport from "passport";
import initializePassport from "../config/passport.config.js";
import productsRouter from "../products/router/products.routes.js";
import cartsRouter from "../carts/router/carts.routes.js";

import {
  //authRouter,
  viewsRouter,
} from "../routes/index.js";

import authRouter from "../users/routes/users.routes.js";

const app = express();
const { port, mongoose_uri } = config;

//mongo connect
connectDB();

//public folder config and middlewares
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoose_uri,
      dbName: "ecommerce",
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 200, // tiempo de visa de la sesión
    }),
    secret: "coder",
    resave: true,
    saveUninitialized: true,
  })
);

//handlebars config
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

//routes
app.use("/", authRouter);
// app.use("/home", auth, viewsRouter);
app.use("/home", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

//server
app.listen(config.port, () => {
  console.log(`Server running on port ${port}`);
});
