import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";

import { connectMongo } from "./src/config/mongo.config.js";
import { initializePassport } from "./src/config/passport.config.js";
import passport from "passport";

import productsRouter from "./src/routes/products.router.js";
import cartsRouter from "./src/routes/carts.router.js";
import sessionRouter from "./src/routes/sessionsRoutes.js";
import viewsRouter from "./src/routes/viewsRoutes.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 8080;

/* ================== MONGO ================== */
await connectMongo();

/* ================== MIDDLEWARES ================== */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ================== SESSION ================== */
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
      collectionName: "sessions",
      ttl: 3600,
    }),
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  }),
);

/* ================== PASSPORT ================== */
initializePassport();
app.use(passport.initialize());

/* ================== HANDLEBARS ================== */
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");

/* ================== ROUTES ================== */
app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

/* ================== SERVER ================== */
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
