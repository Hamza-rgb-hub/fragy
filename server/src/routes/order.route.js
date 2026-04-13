import express from "express";
import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";
import {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  trackOrder
} from "../controllers/order.controller.js";

const router = express.Router();

// ── Admin routes ──────────────────────────────────────────────────────────────
router.get(   "/all",        verifyToken, isAdmin, getAllOrders);
router.put(   "/:id/status", verifyToken, isAdmin, updateOrderStatus);

// ── Public route (no auth) ────────────────────────────────────────────────────
router.get("/track", trackOrder);

// ── User routes ───────────────────────────────────────────────────────────────
router.post(  "/",           verifyToken, createOrder);
router.get(   "/",           verifyToken, getUserOrders);
router.get(   "/:id",        verifyToken, getOrderById);
router.patch( "/:id/cancel", verifyToken, cancelOrder);

export default router;