import { Router } from "express";
import { authToken } from "../middlewares/auth.js";
import productos from "../models/productosModel.js";
import UserService from "../services/users.service.js";

const router = Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/productos", authToken, async (req, res) => {
  try {
    const productosDB = await productos.find().lean();
    res.render("productos", {
      productos: productosDB,
      user: await UserService.getUserById(req.user.id),
    });
  } catch (error) {
    console.error(error);
    res.status(500).render("error", {
      error: "Error al obtener los productos",
    });
  }
});

router.get("/profile", authToken, async (req, res) => {
  const user = await UserService.getUserById(req.user.id);
  res.render("profile", { user });
});

router.get("/forgot-password", (req, res) => {
  res.render("forgotPassword");
});
router.get("/reset-password/:token", async (req, res) => {
  const user = await UserService.validateResetToken(req.params.token);

  if (!user) {
    return res.render("error", { error: "Token inválido o expirado" });
  }

  res.render("resetPassword", { token: req.params.token });
});

export default router;
