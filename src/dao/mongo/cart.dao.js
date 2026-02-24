import CartModel from "../../models/cart.model.js";

class CartDAO {
  async create() {
    return await CartModel.create({ products: [] });
  }

  async getById(id) {
    return await CartModel.findById(id).populate("products.product");
  }

  async update(id, data) {
    return await CartModel.findByIdAndUpdate(id, data, { new: true });
  }
}

export default new CartDAO();
