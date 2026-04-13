import mongoose from "mongoose";

const perfumeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },

    tags: {
      type: [String],
      default: [],
    },

    description: String,
    category: String,
    size: String,

    isNewArrival: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    limitedEdition: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },

    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },

    image: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

const Perfume = mongoose.model("Perfume", perfumeSchema);

export default Perfume;