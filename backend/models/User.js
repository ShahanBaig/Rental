import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto"

const UserSchema = new mongoose.Schema({
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
  createdAt: {
    type: Date,
    default: Date.now,
  },

  resetPasswordToken: String,
  resetPasswordExpire: Date,
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
});

// JWT Token
UserSchema.methods.getJWTToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Compare password
UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate password reset token
UserSchema.methods.getResetPasswordToken = function () {
  // Create token
  const resetToken = crypto.randomBytes(20).toString('hex')

  // Hash the token and save to object
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

  // Add time expiry to the token
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

  // Return token without hash
  return resetToken
}

const User = mongoose.model("User", UserSchema);
export default User;
