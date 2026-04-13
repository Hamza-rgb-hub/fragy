import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  fullName: { type: String },
  street: { type: String },
  city: { type: String },
  state: { type: String },
  zip: { type: String },
  country: { type: String, default: "PK" },
  phone: { type: String },
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  perfume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Perfume",
  },

  name: { type: String, required: true },
  brand: { type: String },
  category: { type: String },
  image: { type: String },
  price: { type: Number, required: true },
  size: { type: String },
  quantity: { type: Number, default: 1, min: 1 },
}, { _id: false });

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      index: true,
    },

    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },

    items: [orderItemSchema],
    shippingAddress: addressSchema,

    subtotal: { type: Number, default: 0 },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["card", "cod", "bank_transfer", "jazz_cash", "easy_paisa"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },

    trackingNumber: { type: String, default: null },
    shippingCarrier: { type: String, default: null },
    estimatedDelivery: { type: Date, default: null },
    deliveredAt: { type: Date, default: null },

    cancellationReason: { type: String, default: null },
    notes: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function () {
  if (this.orderId) return;

  const year = new Date().getFullYear();
  const unique = Date.now().toString().slice(-6);

  this.orderId = `ORD-${year}-${unique}`;
});
const Order = mongoose.model("Order", orderSchema);
export default Order;