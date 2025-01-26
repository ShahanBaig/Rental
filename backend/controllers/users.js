import User from "../models/User.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwttoken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto";

export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a sample id",
      url: "profilePicUrl",
    },
  });

  sendToken(user, res, 201, "Registration successful.");
});

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorHandler("Please enter a valid email and password.", 400)
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password.", 401));
  }

  sendToken(user, res, 200, "Logged in.");
});

export const logout = catchAsyncErrors(function (req, res, next) {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out.",
  });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  // Pull out the email & match it with correct user.
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Prep email
  const resetPasswordUrl =
    req.protocol +
    "://" +
    req.get("host") +
    "/users/password/reset/" +
    resetToken;
  const message =
    "Your password reset token is: \n\n" +
    resetPasswordUrl +
    "\n\nIf you did not request this email, please ignore this.";

  // Send email
  try {
    await sendEmail({
      email: user.email,
      subject: "Password Recovery",
      message,
    });

    res.status(200).json({
      success: true,
      message: "Email sent to " + user.email + " successfully.",
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  // Hash the token and save to object
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(
      new ErrorHandler("Reset password token is invalid or has expired.", 404)
    );
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400));
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save();

  sendToken(user, res, 200, "Password resetted.");
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Old password is incorrect.", 400));
  }

  if (req.body.newPassword != req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match.", 400));
  }

  user.password = req.body.newPassword;
  user.save();

  sendToken(user, res, 200, "Password Updated.");
});

export const getLoggedInUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    message: "Retrieved user.",
    user,
  });
});

export const updateAccount = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };

  // add cloudinary or aws s3 later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "Account updated.",
    user
  });
});

export const updatePaymentInformation = catchAsyncErrors(async (req, res, next) => {
  const {
    lastFourDigits,
    cardBrand,
    expirationDate,
    cardHolderName,
    isDefault,
  } = req.body;

  if (
    lastFourDigits === undefined ||
    cardBrand === undefined ||
    expirationDate === undefined||
    cardHolderName === undefined
  ) {
    throw new Error("All fields must be provided for the update.");
  }

  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      "banking.lastFourDigits": lastFourDigits,
      "banking.cardBrand": cardBrand,
      "banking.expirationDate": expirationDate,
      "banking.cardHolderName": cardHolderName,
      "banking.isDefault": isDefault
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Payment information updated.",
    user
  });
});

// Admin
export const updateUserRole = catchAsyncErrors(async (req, res, next) => {
  let user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 400)
    );
  }

  const newUserData = {
    role: req.body.role,
  };

  user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    message: "User role updated.",
  });
});

// Admin
export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    message: "Retrieved all users.",
    users,
  });
});

// Admin
export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with ID ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    message: "Retrieved user.",
    user,
  });
});

// Admin
export const deleteUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  // we will remove cloudinary later

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with ID: ${req.params.id}`, 400)
    );
  }

  // Make sure we delete all lingering data
  // Delete existing reviews (reviews need their own object)
  // Delete existing posted products from db

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted.",
  });
});

export const getUserReviews = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.params.userId).populate("reviews");

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with ID: ${req.params.userId}`, 400)
    );
  }

  res.status(200).json({
    success: true,
    message: "Retrieved reviews.",
    reviews: user.reviews,
  });
});

export const getAllReviewsByLoggedInUser = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("reviews");

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with ID: ${req.user._id}`, 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Retrieved reviews.",
      reviews: user.reviews,
    });
  }
);

export const getAllReviewsOfLoggedInUser = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id).populate("reviewed");

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with ID: ${req.user._id}`, 400)
      );
    }

    res.status(200).json({
      success: true,
      message: "Retrieved reviews.",
      reviews: user.reviewed,
    });
  }
);
