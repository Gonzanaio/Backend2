import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Mongo conectado");
  } catch (error) {
    console.log("Error conectando Mongo", error);
    process.exit();
  }
};
