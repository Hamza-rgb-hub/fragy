import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  getCart,
} from "../controllers/cart.controller.js";


const router = express.Router();

// ---------- CART ----------
router.get("/", verifyToken, getCart);
router.post("/add", verifyToken, addToCart);
router.post("/remove", verifyToken, removeFromCart);
router.post("/update", verifyToken, updateCartItem);

export default router;