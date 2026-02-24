import { Router } from "express";
import passport from "passport";
import UserDTO from "../dto/user.dto.js";
import { authToken } from "../middlewares/auth.js";
import UserService from "../services/users.service.js";
console.log("Cargando rutas de sesiones...", "USERSERVICE:", UserService);
const router = Router();

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    await UserService.register(req.body);
    // res.status(201).send("Usuario registrado correctamente con carrito");
    res.redirect("/");
  } catch (error) {
    if (error.message === "USER_ALREADY_EXISTS") {
      return res.status(400).send("El email ya está registrado");
    }

    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

// ================= LOGIN =================
router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const token = await UserService.login(req.user);

      res.cookie("jwtCookie", token, {
        httpOnly: true,
        secure: false,
        maxAge: 60 * 60 * 1000,
      });

      res.redirect("/productos");
    } catch (error) {
      res.status(500).send("Error al generar el login");
    }
  },
);

// ================= CURRENT (DTO) =================
router.get("/current", authToken, async (req, res) => {
  try {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
  } catch (error) {
    res.status(500).send("Error al obtener el usuario");
  }
});
router.get("/logout", (req, res) => {
  res.clearCookie("jwtCookie");
  res.redirect("/");
});

// ================= FORGOT PASSWORD =================
router.post("/forgot-password", async (req, res) => {
  try {
    await UserService.generatePasswordReset(req.body.email);
    res.send("Correo de recuperación enviado");
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).send("Usuario no encontrado");
    }
    res.status(500).send("Error al solicitar recuperación");
  }
});

// ================= RESET PASSWORD =================
router.post("/reset-password/:token", async (req, res) => {
  try {
    await UserService.resetPassword(req.params.token, req.body.password);
    res.redirect("/");
  } catch (error) {
    res.status(400).json({ status: "error", error: error.message });
  }
});

export default router;
