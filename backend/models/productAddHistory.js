import mongoose from "mongoose";

const productAddHistory = mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "products",
    },
    count: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ProductAddHistory = mongoose.model(
  "productAddHistory",
  productAddHistory
);

export default ProductAddHistory;
