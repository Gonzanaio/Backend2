import ProductDAO from "../dao/mongo/product.dao.js";

const ProductRepository = {
  getAll: () => ProductDAO.getAll(),

  getById: (id) => ProductDAO.getById(id),

  create: (data) => ProductDAO.create(data),

  update: (id, data) => ProductDAO.update(id, data),

  delete: (id) => ProductDAO.delete(id),
};

export default ProductRepository;
