import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import passport from "./src/config/passport.config.js";
import { initializePassport } from "./src/config/passport.config.js";

import sessionRouter from "./src/routes/sessionsRoutes.js";
import viewsRouter from "./src/routes/viewsRoutes.js";

const app = express();

const PORT = 8080;
//Mongoose
mongoose.connect("mongodb://localhost:27017/HandsOnLab");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//Session
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/HandsOnLab",
      collectionName: "sessions",
      ttl: 3600,
    }),
    secret: "mySecretKey",
  }),
);

//Passport
initializePassport();
app.use(passport.initialize());

//Engine handlebarsf
app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "src/views");
//Routes

app.use("/", viewsRouter);
app.use("/api/sessions", sessionRouter);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
