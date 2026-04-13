import express from 'express';
import { verifyToken, isAdmin, authUserMiddleware } from "../middlewares/auth.middleware.js";
import {
  submitRequest,
  trackRequest,
  getAllRequests,
  getRequestById,
  updateRequestStatus,
  deleteRequest,
  getRequestStats,
} from '../controllers/return.controller.js';

const router = express.Router();

// ── PUBLIC (no auth required) ──
router.post('/submit', authUserMiddleware, submitRequest);   
router.get('/track', authUserMiddleware, trackRequest); 

// ── ADMIN ONLY ──
router.use(verifyToken, isAdmin);

router.get('/stats', getRequestStats);   
router.get('/', getAllRequests);
router.get('/:id', getRequestById);     
router.patch('/:id/status', updateRequestStatus);
router.delete('/:id', deleteRequest);

export default router;