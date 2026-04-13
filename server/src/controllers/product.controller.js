import Perfume from "../models/product.model.js";
import cloudinary from "../services/cloudinary.js";

const normalizeTags = (rawTags, category = "", flags = {}) => {
  let parsed = rawTags
    ? rawTags.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)
    : [];

  if (category) {
    parsed.push(category.toLowerCase());
    if (category.toLowerCase() === "floral") {
      parsed.push("romantic", "soft");
    }
  }

  if (flags.bestSeller)     parsed.push("best seller");
  if (flags.limitedEdition) parsed.push("limited edition");
  if (flags.isNewArrival)   parsed.push("new arrival");
  if (flags.featured)       parsed.push("featured");

  return [...new Set(parsed)];
};

const uploadImage = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "perfumes" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });

const parseBool = (val) => val === "true" || val === true;

// -------------------- CREATE --------------------
export const createPerfume = async (req, res) => {
  try {
    const {
      name, brand, tags, price, stock,
      description, category, size,
      isNewArrival, bestSeller, limitedEdition, featured,
    } = req.body;

    if (!name || !brand || price === undefined)
      return res.status(400).json({ message: "Name, brand and price required" });
    if (isNaN(price))
      return res.status(400).json({ message: "Price must be a number" });

    let imageData = {};
    if (req.file?.buffer) {
      const result = await uploadImage(req.file.buffer);
      imageData = { url: result.secure_url };
    }

    const flags = {
      isNewArrival:   parseBool(isNewArrival),
      bestSeller:     parseBool(bestSeller),
      limitedEdition: parseBool(limitedEdition),
      featured:       parseBool(featured),
    };

    const parsedTags = normalizeTags(tags, category, flags);

    const perfume = await Perfume.create({
      name, brand, description, category, size,
      tags: parsedTags,
      price: Number(price),
      stock: stock ? Number(stock) : 0,
      image: imageData,
      ...flags,
    });

    res.status(201).json({ message: "Perfume created successfully", perfume });
  } catch (error) {
    console.error("Create perfume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- FETCH ALL --------------------
export const getAllPerfumes = async (req, res) => {
  try {
    const perfumes = await Perfume.find().sort({ createdAt: -1 });
    res.status(200).json({ perfumes });
  } catch (error) {
    console.error("Get all perfumes error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- FETCH SINGLE --------------------
export const getPerfumeById = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) return res.status(404).json({ message: "Perfume not found" });
    res.status(200).json({ perfume });
  } catch (error) {
    console.error("Get perfume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- UPDATE --------------------
export const updatePerfume = async (req, res) => {
  try {
    const {
      name, brand, tags, price, stock,
      description, category, size,
      isNewArrival, bestSeller, limitedEdition, featured,
    } = req.body;

    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) return res.status(404).json({ message: "Perfume not found" });

    if (req.file?.buffer) {
      const result = await uploadImage(req.file.buffer);
      perfume.image = { url: result.secure_url };
    }

    if (name)                      perfume.name        = name;
    if (brand)                     perfume.brand       = brand;
    if (description !== undefined) perfume.description = description;
    if (category    !== undefined) perfume.category    = category;
    if (size        !== undefined) perfume.size        = size;

    if (price !== undefined) {
      if (isNaN(price)) return res.status(400).json({ message: "Price must be a number" });
      perfume.price = Number(price);
    }
    if (stock !== undefined) perfume.stock = Number(stock);

    if (isNewArrival   !== undefined) perfume.isNewArrival   = parseBool(isNewArrival);
    if (bestSeller     !== undefined) perfume.bestSeller     = parseBool(bestSeller);
    if (limitedEdition !== undefined) perfume.limitedEdition = parseBool(limitedEdition);
    if (featured       !== undefined) perfume.featured       = parseBool(featured);

    if (tags !== undefined) {
      const flags = {
        isNewArrival:   perfume.isNewArrival,
        bestSeller:     perfume.bestSeller,
        limitedEdition: perfume.limitedEdition,
        featured:       perfume.featured,
      };
      perfume.tags = normalizeTags(tags, perfume.category, flags);
    }

    await perfume.save();
    res.status(200).json({ message: "Perfume updated successfully", perfume });
  } catch (error) {
    console.error("Update perfume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// -------------------- DELETE --------------------
export const deletePerfume = async (req, res) => {
  try {
    const perfume = await Perfume.findById(req.params.id);
    if (!perfume) return res.status(404).json({ message: "Perfume not found" });
    await perfume.deleteOne();
    res.status(200).json({ message: "Perfume deleted successfully" });
  } catch (error) {
    console.error("Delete perfume error:", error);
    res.status(500).json({ message: "Server error" });
  }
};