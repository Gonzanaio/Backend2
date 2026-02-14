import { Router } from "express";
import { authToken } from "../middlewares/auth.js";
import productos from "../models/productosModel.js";

const router = Router();

// LOGIN (sin middleware)
router.get("/", (req, res) => {
  res.render("login");
});

// REGISTER (sin middleware)
router.get("/register", (req, res) => {
  res.render("register");
});

// PRODUCTOS (protegido)
router.get("/productos", authToken, async (req, res) => {
  try {
    const productosDB = await productos.find().lean();
    res.render("productos", {
      productos: productosDB,
      user: req.user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener los productos",
    });
  }
});

// PROFILE (protegido)
router.get("/profile", authToken, (req, res) => {
  res.render("profile", { user: req.user });
});

export default router;
