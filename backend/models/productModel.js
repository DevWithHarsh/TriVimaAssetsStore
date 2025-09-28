import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  cost: { type: Number, required: true },
  image: { type: Array, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  bestseller: { type: Boolean },
  stock: { type: Number, default: 0 },
  date: { type: Number, required: true },

  // Ratings
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },

  // ✅ 3D Asset Fields
  zipFile: { type: String, default: null }, // Can store Cloudinary URL OR Google Drive link
  zipFileType: { type: String, enum: ['upload', 'drive_link'], default: 'upload' }, // Track source type
  fileSize: { type: String, default: null }, // Optional: store file size info
  fileFormat: { type: String, default: 'ZIP' }, // File format (ZIP, RAR, etc.)

  // tags for categorization
  tag: {
    type: String,
    enum: ['topBundles', 'hotNew', 'mostPopular', 'startHere'],
    required: true,
    default: 'hotNew'
  }
});

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;