import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviewedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be above 1."],
      max: [5, "Rating must be smaller than 6."],
    },
    comment: {
      type: String,
      required: true,
    },
    createdAt: {
    type: Date,
    default: Date.now,
  },
  }
);

// Unique compound index
reviewSchema.index({ owner: 1, reviewedUser: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);

export default Review;
