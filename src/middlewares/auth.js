import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  // puede no existir cookies todavía
  if (!req.cookies || !req.cookies.jwtCookie) {
    return res.status(401).send("No autorizado: usuario no logueado");
  }

  const token = req.cookies.jwtCookie;

  try {
    const user = jwt.verify(token, "secretJWT");
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).send("Token inválido o expirado");
  }
};
