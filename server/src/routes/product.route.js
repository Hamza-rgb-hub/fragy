import express from "express";
import upload from "../utils/upload.js";
import { isAdmin, verifyToken } from "../middlewares/auth.middleware.js";
import {
  createPerfume,
  getAllPerfumes,
  getPerfumeById,
  updatePerfume,
  deletePerfume,
} from "../controllers/product.controller.js";

const router = express.Router();

// -------------------- CREATE --------------------
router.post(
  "/create",
  verifyToken,           // Verify JWT
  isAdmin,               // Admin check
  upload.single("image"),// Single image upload (memory storage)
  createPerfume
);

// -------------------- FETCH ALL --------------------
router.get("/", getAllPerfumes);

// -------------------- FETCH SINGLE --------------------
router.get("/:id", getPerfumeById);

// -------------------- UPDATE --------------------
router.put(
  "/update/:id",
  verifyToken,           // Verify JWT
  isAdmin,               // Admin check
  upload.single("image"),// Optional new image
  updatePerfume
);

// -------------------- DELETE --------------------
router.delete(
  "/delete/:id",
  verifyToken,           // Verify JWT
  isAdmin,               // Admin check
  deletePerfume
);

export default router;