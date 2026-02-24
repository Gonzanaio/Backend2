import { Router } from "express";
import carts from "../models/cart.model.js";
import productos from "../models/productosModel.js";
import { authToken } from "../middlewares/auth.js";
import { authorize } from "../middlewares/authorization.js";

const router = Router();

// agregar producto al carrito
router.post(
  "/:cid/product/:pid",
  authToken,
  authorize("user"),
  async (req, res) => {
    try {
      const cart = await carts.findById(req.params.cid);
      const product = await productos.findById(req.params.pid);

      if (!cart || !product) {
        return res.status(404).send("Carrito o producto no encontrado");
      }

      const existingProduct = cart.products.find(
        (p) => p.product.toString() === req.params.pid,
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: req.params.pid, quantity: 1 });
      }

      await cart.save();

      res.send("Producto agregado al carrito");
    } catch (error) {
      res.status(500).send("Error al agregar producto");
    }
  },
);

export default router;
