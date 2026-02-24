import usuarios from "../../models/userModel.js";

class UserDAO {
  /* ================= GET ================= */

  async getByEmail(email) {
    return await usuarios.findOne({ email });
  }

  async getById(id) {
    return await usuarios.findById(id).lean();
  }

  async getByResetToken(token) {
    return await usuarios.findOne({
      resetPasswordToken: token,
    });
  }

  /* ================= CREATE ================= */

  async create(userData) {
    return await usuarios.create(userData);
  }

  /* ================= UPDATE ================= */

  async update(id, updateData) {
    return await usuarios.findByIdAndUpdate(id, updateData, { new: true });
  }
}

export default new UserDAO();
