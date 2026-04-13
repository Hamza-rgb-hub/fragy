import express from 'express'
import {
  adminDelete, adminFetch, adminFetchAll, adminLogin, adminLogout,
  adminRegister, adminUpdate, userLogin, userLogout, userRegister,
  updateUserRole, deleteUser, getCurrentUser,
} from '../controllers/auth.controller.js';
import upload from '../utils/upload.js';
import { isAdmin, isSuperAdmin, verifyToken } from '../middlewares/auth.middleware.js';

const router = express.Router();

// User auth routes
router.post("/user/register", userRegister);
router.post("/user/login", userLogin);
router.get('/user/logout', userLogout);
router.get('/user', verifyToken, getCurrentUser);
router.put('/user/:id/role', verifyToken, isAdmin, updateUserRole);
router.delete('/user/:id', verifyToken, isAdmin, deleteUser);

// Admin routes
router.post('/admin/register', isSuperAdmin, adminRegister); // 
router.post('/admin/login', adminLogin);
router.get('/admin/logout', adminLogout);
router.get('/admin/show', verifyToken, adminFetch);
router.get('/admin/showAll', verifyToken, isAdmin, adminFetchAll);
router.put('/admin/update/:id', verifyToken, isSuperAdmin, upload.single('image'), adminUpdate);
router.delete('/admin/delete/:id', verifyToken, isSuperAdmin, adminDelete);

export default router;