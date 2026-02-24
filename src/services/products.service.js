import ProductRepository from "../repositories/products.repository.js";
import CustomError from "../errors/CustomError.js";

const productService = {
  /* ================= GET ALL ================= */
  getAll: async () => {
    const products = await ProductRepository.getAll();

    if (!products) {
      throw new CustomError("No se pudieron obtener los productos", 500);
    }

    return products;
  },

  /* ================= CREATE ================= */
  create: async (data) => {
    const { title, price, stock } = data;

    // Validaciones de negocio
    if (!title || !price || stock === undefined) {
      throw new CustomError("El producto debe tener title, price y stock", 400);
    }

    if (price <= 0) {
      throw new CustomError("El precio debe ser mayor a 0", 400);
    }

    if (stock < 0) {
      throw new CustomError("El stock no puede ser negativo", 400);
    }

    const newProduct = await ProductRepository.create(data);

    if (!newProduct) {
      throw new CustomError("No se pudo crear el producto", 500);
    }

    return newProduct;
  },

  /* ================= UPDATE ================= */
  update: async (id, data) => {
    if (!id) {
      throw new CustomError("ID de producto inválido", 400);
    }

    const updated = await ProductRepository.update(id, data);

    if (!updated) {
      throw new CustomError("Producto no encontrado", 404);
    }

    return updated;
  },

  /* ================= DELETE ================= */
  delete: async (id) => {
    if (!id) {
      throw new CustomError("ID de producto inválido", 400);
    }

    const deleted = await ProductRepository.delete(id);

    if (!deleted) {
      throw new CustomError("Producto no encontrado", 404);
    }

    return deleted;
  },
};

export default productService;
