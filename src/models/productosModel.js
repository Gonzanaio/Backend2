import mongoose from "mongoose";

const collectionName = "productos";

const productSchema = new mongoose.Schema({
  nombre: String,
  precio: Number,
});

const productos = mongoose.model(collectionName, productSchema);

export default productos;
