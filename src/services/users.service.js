import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import UserRepository from "../repositories/users.repository.js";
import { sendRecoveryEmail } from "./mail.service.js";
import CartRepository from "../repositories/carts.repository.js";

class UserService {
  /* ================= REGISTER ================= */
  async register(userData) {
    const { first_name, last_name, email, age, password } = userData;

    // verificar duplicado
    const exists = await UserRepository.getUserByEmail(email);
    if (exists) throw new Error("USER_ALREADY_EXISTS");

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // crear carrito
    const cart = await CartRepository.createCart();

    // crear usuario
    const newUser = await UserRepository.createUser({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      cart: cart._id,
      role: "user",
    });

    return newUser;
  }

  /* ================= LOGIN ================= */
  async login(user) {
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        cart: user.cart,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return token;
  }
  async getUserById(id) {
    const user = await UserRepository.getUserById(id);
    return user;
  }

  /* ================= FORGOT PASSWORD ================= */
  async generatePasswordReset(email) {
    const user = await UserRepository.getUserByEmail(email);
    if (!user) throw new Error("USER_NOT_FOUND");

    const token = crypto.randomBytes(32).toString("hex");

    await UserRepository.updateUser(user._id, {
      resetPasswordToken: token,
      resetPasswordExpires: Date.now() + 3600000,
    });

    await sendRecoveryEmail(user.email, token);
  }

  /* ================= RESET PASSWORD ================= */
  async resetPassword(token, newPassword) {
    const user = await UserRepository.getUserByResetToken(token);
    if (!user) throw new Error("INVALID_TOKEN");

    if (user.resetPasswordExpires < Date.now())
      throw new Error("TOKEN_EXPIRED");

    // evitar misma contraseña
    const isSame = await bcrypt.compare(newPassword, user.password);
    if (isSame) throw new Error("SAME_PASSWORD");

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await UserRepository.updateUser(user._id, {
      password: hashedPassword,
      resetPasswordToken: null,
      resetPasswordExpires: null,
    });
  }

  async validateResetToken(token) {
    const user = await UserRepository.getUserByResetToken(token);
    return user;
  }
}

export default new UserService();
