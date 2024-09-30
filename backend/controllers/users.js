import User from "../models/User.js";
import ErrorHandler from "../utils/errorhandler.js";
import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import sendToken from "../utils/jwttoken.js";
import sendEmail from "../utils/sendEmail.js";
import crypto from "crypto"

export const registerUser = catchAsyncErrors(async (req, res, next) => {
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

  sendToken(user, res, 201);
});

export const loginUser = catchAsyncErrors(async (req, res, next) => {
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

  sendToken(user, res, 200);
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
  // Pull out the email & match it with correct user
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  // Get reset password token
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });

  // Prep email
  const resetPasswordUrl =
    req.protocol + "://" + req.get("host") + "/users/password/reset/" + resetToken;
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
  const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has expired.", 404))
  }

  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Passwords do not match.", 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  await user.save()

  sendToken(user, res, 200)
});
