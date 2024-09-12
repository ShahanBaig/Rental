import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
    {
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
            }
        ],
        category: {
            type: String,
            required: [true, "Please enter a category."]
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
    }
);

const Product = mongoose.model("Product", ProductSchema);
export default Product;