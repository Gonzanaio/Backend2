import userDAO from "../dao/mongo/user.dao.js";

class UserRepository {
  /* ================= GET ================= */

  async getUserByEmail(email) {
    return await userDAO.getByEmail(email);
  }

  async getUserById(id) {
    return await userDAO.getById(id);
  }

  async getUserByResetToken(token) {
    return await userDAO.getByResetToken(token);
  }

  /* ================= CREATE ================= */

  async createUser(userData) {
    return await userDAO.create(userData);
  }

  /* ================= UPDATE ================= */

  async updateUser(id, updateData) {
    return await userDAO.update(id, updateData);
  }
}

export default new UserRepository();
