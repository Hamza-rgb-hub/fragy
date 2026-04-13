import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// User Register
export const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        quizCompleted: user.quizCompleted,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Login
export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User Login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        personalityTags: user.personalityTags,
        quizCompleted: user.quizCompleted,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// User Logout
export const userLogout = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
  res.status(200).json({ message: "User Logout successfully" });
};

// Admin Register — protected by verifyToken + isSuperAdmin middleware
export const adminRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ success: false, message: "All fields required" });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(409).json({ success: false, message: "Email already registered" });

    if (password.length < 8)
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });

    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      role: "admin", // always forced to admin
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Admin Register Error:", error);
    res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
  }
};

// Admin Login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ success: false, message: "Invalid Email" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ success: false, message: "Incorrect Password" });

    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin logged in successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    console.error("Admin Login Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Fetch Current User
export const adminFetch = (req, res) => {
  if (!req.user)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  res.status(200).json({ success: true, user: req.user });
};

// Admin Fetch All
export const adminFetchAll = async (req, res) => {
  try {
    const allUsers = await User.find().select("-password");
    if (!allUsers)
      return res.status(404).json({ success: false, message: "Users Not Found" });
    return res.status(200).json({ success: true, users: allUsers });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Update
export const adminUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password, role } = req.body;

    const admin = await User.findById(id);
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin Not Found" });

    if (email && email !== admin.email) {
      const emailExist = await User.findOne({ email });
      if (emailExist)
        return res.status(409).json({ success: false, message: "Email Already Exist" });
    }

    let hashPassword = admin.password;
    if (password) {
      if (password.length < 8)
        return res.status(400).json({ success: false, message: "Password At Least 8 Characters" });
      hashPassword = await bcrypt.hash(password, 10);
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.role = role || admin.role;
    admin.password = hashPassword;

    await admin.save();
    res.status(200).json({ success: true, message: "Admin Updated Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Delete
export const adminDelete = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only Super Admin Can Delete" });

    const { id } = req.params;
    const admin = await User.findById(id);
    if (!admin)
      return res.status(404).json({ success: false, message: "Admin Not Found" });

    await User.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Admin Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Admin Logout
export const adminLogout = (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({ success: true, message: "Logout Successfully" });
};

// Update User Role
export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    if (!role)
      return res.status(400).json({ success: false, message: "Role is required" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User Not Found" });

    user.role = role;
    await user.save();

    res.status(200).json({ success: true, message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete User
export const deleteUser = async (req, res) => {
  try {
    if (req.user.role !== "superadmin")
      return res.status(403).json({ success: false, message: "Only Super Admin Can Delete" });

    const user = await User.findById(req.params.id);
    if (!user)
      return res.status(404).json({ success: false, message: "User Not Found" });

    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Current User
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id || req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};