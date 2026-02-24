import cartDAO from "../dao/mongo/cart.dao.js";

class CartRepository {
  async createCart() {
    return await cartDAO.create();
  }

  async getCartById(id) {
    return await cartDAO.getById(id);
  }

  async updateCart(id, data) {
    return await cartDAO.update(id, data);
  }
}

export default new CartRepository();
