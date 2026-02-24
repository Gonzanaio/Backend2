import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendRecoveryEmail = async (email, token) => {
  const link = `http://localhost:8080/reset-password/${token}`;

  await transporter.sendMail({
    from: `Ecommerce Backend <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Recuperar contraseña",
    html: `
      <h2>Recuperación de contraseña</h2>
      <p>Hacé click en el botón para restablecer tu contraseña</p>

      <a href="${link}">
        <button style="
          padding:10px 20px;
          background:black;
          color:white;
          border:none;
          cursor:pointer;">
          Restablecer contraseña
        </button>
      </a>

      <p>Este enlace expira en 1 hora</p>
    `,
  });
};
