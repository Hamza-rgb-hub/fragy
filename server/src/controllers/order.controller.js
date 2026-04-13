import Cart from "../models/cart.model.js";
import Order from "../models/order.model.js";
import User from "../models/user.model.js";

// ── Create Order  ───────────────────────────────────────────
export const createOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress } = req.body;

    // ── Validate shipping address ─────────────────────────────────────────────
    if (!shippingAddress?.fullName || !shippingAddress?.address ||
      !shippingAddress?.city || !shippingAddress?.country ||
      !shippingAddress?.phone) {
      return res.status(400).json({ message: "Incomplete shipping address" });
    }

    // ── Get user email ────────────────────────────────────────────────────────
    const user = await User.findById(userId).select("email");
    if (!user) return res.status(404).json({ message: "User not found" });

    // ── Get cart from DB ──────────────────────────────────────────────────────
    const cart = await Cart.findOne({ user: userId }).populate("items.perfume");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // ── Build order items ─────────────────────────────────────────────────────
    const orderItems = cart.items.map((item) => ({
      perfume: item.perfume._id,
      name: item.perfume.name || "Fragrance",
      brand: item.perfume.brand || "",
      category: item.perfume.category || "",
      image: item.perfume.image || null,
      price: item.perfume.price,
      size: item.perfume.size || "",
      quantity: item.quantity,
    }));

    const totalAmount = orderItems.reduce(
      (acc, item) => acc + item.price * item.quantity, 0
    );

    // ── Save order ────────────────────────────────────────────────────────────
    const order = new Order({
      user: userId,
      email: user.email,
      items: orderItems,
      totalAmount,
      shippingAddress,
      paymentMethod: "cod",
      paymentStatus: "pending",
      status: "pending",
    });

    await order.save();

    // ── Clear cart ────────────────────────────────────────────────────────────
    await Cart.findOneAndUpdate({ user: userId }, { items: [] });

    // ── Populate response ─────────────────────────────────────────────────────
    await order.populate("items.perfume", "name price size image category");

    res.status(201).json({
      message: "Order placed successfully",
      order,
      orderId: order._id,
    });

  } catch (error) {
    console.error("Create order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── Get User Orders (GET /api/orders) ─────────────────────────────────────────
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;
    const orders = await Order.find({ user: userId })
      .populate("items.perfume", "name price size image category")
      .sort({ createdAt: -1 });

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── Get Single Order (GET /api/orders/:id) ────────────────────────────────────
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).populate("items.perfume", "name price size image category");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.status(200).json({ order });
  } catch (error) {
    console.error("Get order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── Cancel Order (PATCH /api/orders/:id/cancel) ───────────────────────────────
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.status !== "pending") {
      return res.status(400).json({ message: `Cannot cancel a ${order.status} order` });
    }

    order.status = "cancelled";
    await order.save();

    res.status(200).json({ message: "Order cancelled", order });
  } catch (error) {
    console.error("Cancel order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ── Admin: Get All Orders (GET /api/orders/all) ───────────────────────────────
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.perfume", "name price size image category")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Admin: Update Order Status (PUT /api/orders/:id/status) ──────────────────
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: "Order not found" });

    order.status = status;
    await order.save();

    res.status(200).json({ success: true, message: "Status updated", order });
  } catch (error) {
    console.error("Update status error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Track Order (GET /api/orders/track) — Public ──────────────────────────────
export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.query;

    if (!orderId || !email) {
      return res.status(400).json({
        success: false,
        message: "Both orderId and email are required.",
      });
    }

    const sanitizedEmail = email.trim().toLowerCase();

    // ── Find by orderId string OR MongoDB _id ─────────────────────────────────
    const isMongoId = /^[a-f\d]{24}$/i.test(orderId.trim());
    const query = isMongoId
      ? { $or: [{ orderId: orderId.trim() }, { _id: orderId.trim() }] }
      : { orderId: orderId.trim() };

    const order = await Order.findOne(query).lean();

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No order found with this Order ID.",
      });
    }

    // ── Email verification ────────────────────────────────────────────────────
    const orderEmail = (order.email || "").trim().toLowerCase();

    if (!orderEmail) {
      // ── Old orders without email field: look up via user ───────────────────
      const user = await User.findById(order.user).select("email").lean();
      const userEmail = (user?.email || "").trim().toLowerCase();
      if (userEmail !== sanitizedEmail) {
        return res.status(403).json({
          success: false,
          message: "No order found with this ID and email combination.",
        });
      }
    } else if (orderEmail !== sanitizedEmail) {
      return res.status(403).json({
        success: false,
        message: "No order found with this ID and email combination.",
      });
    }

    // ── Format items (uses snapshot data from orderItemSchema) ────────────────
    const items = (order.items || []).map((item) => ({
      name: item.name || "Fragrance",
      brand: item.brand || "",
      category: item.category || "",
      image: item.image || null,
      price: item.price || 0,
      size: item.size || "",
      quantity: item.quantity || 1,
    }));

    // ── Response payload ──────────────────────────────────────────────────────
    const payload = {
      orderId: order.orderId || order._id,
      status: order.status || "pending",
      createdAt: order.createdAt,
      totalAmount: order.totalAmount || 0,
      paymentMethod: order.paymentMethod || "",
      trackingNumber: order.trackingNumber || null,
      estimatedDelivery: order.estimatedDelivery || null,
      cancellationReason: order.cancellationReason || null,
      shippingAddress: order.shippingAddress
        ? {
          name: order.shippingAddress.fullName || order.shippingAddress.name || "",
          street: order.shippingAddress.street || order.shippingAddress.address || "",
          city: order.shippingAddress.city || "",
          state: order.shippingAddress.state || "",
          zip: order.shippingAddress.zip || order.shippingAddress.postalCode || "",
        }
        : null,
      items,
    };

    return res.status(200).json({ success: true, order: payload });

  } catch (err) {
    console.error("[Track Order Error]", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};