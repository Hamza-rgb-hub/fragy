import Cart from "../models/cart.model.js";
import Perfume from "../models/product.model.js";

// Add to Cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { perfumeId, quantity } = req.body;

    if (!perfumeId) return res.status(400).json({ message: "Perfume ID required" });

    const perfume = await Perfume.findById(perfumeId);
    if (!perfume) return res.status(404).json({ message: "Perfume not found" });

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [{ perfume: perfumeId, quantity: quantity || 1 }] });
    } else {
      const itemIndex = cart.items.findIndex((item) => item.perfume.toString() === perfumeId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity || 1;
      } else {
        cart.items.push({ perfume: perfumeId, quantity: quantity || 1 });
      }
    }

    await cart.save();
    res.status(200).json({ message: "Added to cart", cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Remove from Cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { perfumeId } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter((item) => item.perfume.toString() !== perfumeId);
    await cart.save();

    res.status(200).json({ message: "Removed from cart", cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { perfumeId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const item = cart.items.find((item) => item.perfume.toString() === perfumeId);
    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await cart.save();

    res.status(200).json({ message: "Cart updated", cart });
  } catch (error) {
    console.error("Update cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get Cart
export const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.perfume");

    res.status(200).json({ cart });
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server error" });
  }
};