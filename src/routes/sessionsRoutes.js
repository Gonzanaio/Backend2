import { Router } from "express";
import usuarios from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";

const router = Router();

/* ================= REGISTER ================= */

router.post("/register", async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body;

  try {
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).send("Todos los campos son obligatorios");
    }

    const existingUser = await usuarios.findOne({ email });
    if (existingUser) {
      return res.status(400).send("El email ya está registrado");
    }

    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));

    await usuarios.create({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
    });

    res.status(201).send("Usuario registrado correctamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al registrar el usuario");
  }
});

/* ================= LOGIN (PASSPORT LOCAL) ================= */

router.post(
  "/login",
  passport.authenticate("login", { session: false }),
  async (req, res) => {
    try {
      const user = req.user;

      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        "secretJWT",
        { expiresIn: "1h" },
      );

      res.cookie("jwtCookie", token, {
        httpOnly: true,
      });

      res.send("Login con Passport exitoso");
    } catch (error) {
      res.status(500).send("Error al generar el login");
    }
  },
);

/* ================= CURRENT (PASSPORT JWT) ================= */

router.get(
  "/current",
  passport.authenticate("current", { session: false }),
  (req, res) => {
    const user = req.user.toObject();
    delete user.password;

    res.json(user);
  },
);

export default router;
