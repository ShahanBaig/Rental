import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    maxLength: [30, "Name cannot exceed 30 characters."],
    minLength: [4, "Name should have more than 4 characters"],
  },

  email: {
    type: String,
    required: [true, "Please enter your email address."],
    unique: true,
    validate: [validator.isEmail, "Please enter a valid email address."],
  },

  password: {
    type: String,
    required: [true, "Please enter your password."],
    minLength: [8, "Password should be greater than 8 characters"],
    select: false,
  },

  avatar: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },

  role: {
    type: String,
    default: "user",
  },

  ratings: {
    type: Number,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  numOfReviewed: {
    type: Number,
    default: 0,
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],

  reviewed: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],

  banking: {
    lastFourDigits: {
      type: String,
      minlength: 4,
      maxlength: 4,
      match: [/^\d{4}$/, "Must be the last four digits of the card"],
    },
    cardBrand: {
      type: String,
      enum: ["Visa", "MasterCard", "American Express", "Discover", "Other"],
    },
    expirationDate: {
      type: String,
      match: [/^(0[1-9]|1[0-2])\/\d{2}$/, "Must be in MM/YY format"],
    },
    cardHolderName: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false, // Indicate if this is the user's default payment method
    },
    addedAt: {
      type: Date,
      default: Date.now, // Timestamp when the card was added
    },
  },

  products: {
    posted: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    total: {
      type: Number,
      default: 0,
    },
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
userSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
  // Create token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash the token and save to object
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Add time expiry to the token
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

  // Return token without hash
  return resetToken;
};

const User = mongoose.model("User", userSchema);
export default User;
