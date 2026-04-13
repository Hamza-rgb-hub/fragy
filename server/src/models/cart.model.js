import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  perfume: { type: mongoose.Schema.Types.ObjectId, ref: "Perfume", required: true },
  quantity: { type: Number, default: 1, min: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;