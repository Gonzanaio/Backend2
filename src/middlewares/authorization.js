export const authorize = (...rolesPermitidos) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).send("No autenticado");
      }

      if (!rolesPermitidos.includes(req.user.role)) {
        return res
          .status(403)
          .send("No tenés permisos para acceder a este recurso");
      }

      next();
    } catch (error) {
      res.status(500).send("Error de autorización");
    }
  };
};
