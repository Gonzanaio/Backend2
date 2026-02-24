export const errorHandler = (err, req, res, next) => {
  console.error("🔥 Error capturado:", err.message);

  const status = err.statusCode || 500;

  res.status(status).json({
    status: "error",
    error: err.message || "Error interno del servidor",
  });
};
