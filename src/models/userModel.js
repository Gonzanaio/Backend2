import mongoose from "mongoose";

const collectionName = "users";

const userSchema = new mongoose.Schema(
  {
    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    age: {
      type: Number,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts",
    },

    role: {
      type: String,
      default: "user",
    },

    // 🔐 recuperación de contraseña
    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const UserModel = mongoose.model(collectionName, userSchema);

export default UserModel;
