import productos from "../../models/productosModel.js";

const ProductDAO = {
  getAll: () => productos.find().lean(),

  getById: (id) => productos.findById(id),

  create: (data) => productos.create(data),

  update: (id, data) => productos.findByIdAndUpdate(id, data, { new: true }),

  delete: (id) => productos.findByIdAndDelete(id),
};

export default ProductDAO;
