import { Router } from "express";
import { authToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";
import productService from "../services/products.service.js";
import CustomError from "../errors/CustomError.js";

const router = Router();

// Obtener productos (logueado)
router.get("/", authToken, async (req, res) => {
  const data = await productService.getAll();
  res.json(data);
});

// Crear producto (ADMIN)
router.post("/", authToken, authorize("admin"), async (req, res, next) => {
  try {
    const nuevo = await productService.create(req.body);

    if (!nuevo) {
      throw new CustomError("No se pudo crear el producto", 400);
    }

    res.status(201).json(nuevo);
  } catch (error) {
    next(error);
  }
});

// Editar producto (ADMIN)
router.put("/:pid", authToken, authorize("admin"), async (req, res) => {
  try {
    await productService.update(req.params.pid, req.body);
    res.send("Producto actualizado");
  } catch {
    res.status(500).send("Error al actualizar");
  }
});

// Eliminar producto (ADMIN)
router.delete("/:pid", authToken, authorize("admin"), async (req, res) => {
  try {
    await productService.delete(req.params.pid);
    res.send("Producto eliminado");
  } catch {
    res.status(500).send("Error al eliminar");
  }
});

export default router;
