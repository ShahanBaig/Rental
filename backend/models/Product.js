import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name."],
    trim: true,
  },
  description: {
    type: String,
    required: [true, "Please enter a description."],
  },
  price: {
    type: Number,
    required: [true, "Please enter a price."],
    maxLength: [8, "Price cannot exceed 8 figures."],
  },
  securityDepositAmount: {
    type: Number,
    required: [true, "Please enter a security deposit."],
    maxLength: [8, "Security deposit cannot exceed 8 figures."],
  },
  cooldownPeriodInHours: {
  type: Number,
  required: true,
  min: [1, "Cooldown period must be at least 1 hour."],
  max: [48, "Cooldown period cannot exceed 48 hours."],
},
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, "Please enter a category."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;
