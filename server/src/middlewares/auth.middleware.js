import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// User auth middleware
export const authUserMiddleware = async (req, res, next) => {
  try {
    let token = null;
    if (req.cookies?.token) token = req.cookies.token;
    else if (req.headers?.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) return res.status(401).json({ message: "Not authorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Verify Token
export const verifyToken = async (req, res, next) => {
  let token = null;
  if (req.cookies?.token) token = req.cookies.token;
  else if (req.headers?.authorization?.startsWith("Bearer ")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return res.status(401).json({ message: "Unauthorized access" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized access" });

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Admin access — admin + superadmin dono
export const isAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "admin" && req.user.role !== "superadmin")) {
    return res.status(403).json({ message: "Admin Access Only" });
  }
  next();
};

// ✅ SuperAdmin only
export const isSuperAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "superadmin") {
    return res.status(403).json({ message: "SuperAdmin Access Only" });
  }
  next();
};
