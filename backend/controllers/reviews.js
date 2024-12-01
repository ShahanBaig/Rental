import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import ErrorHandler from "../utils/errorhandler.js";

export const createReview = catchAsyncErrors(async (req, res, next) => {
  // Find user
  let user = await User.findById(req.params.userId);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with ID: ${req.params.userId}`, 400)
    );
  }

  // Check for existing review
  const existingReview = await Review.findOne({
    owner: req.user._id,
    reviewedUser: req.params.userId,
  });

  if (existingReview) {
    return next(new ErrorHandler("You have already reviewed this user.", 400));
  }

  // Create review
  const review = await Review.create({
    ...req.body,
    ...{ owner: req.user._id, reviewedUser: req.params.userId },
  });

  // Update references and counters
  user.reviews.push(review._id);
  req.user.reviewed.push(review._id);
  user.numOfReviews = user.reviews.length;
  req.user.numOfReviewed = req.user.reviewed.length;

  // Calc average rating
  user = await user.populate("reviews");
  let avg = 0;
  user.reviews.forEach((review) => (avg += review.rating));
  user.ratings = avg / user.reviews.length;

  // Save changes
  await Promise.all([user.save(), req.user.save()]);

  res.status(200).json({
    success: true,
    review,
  });
});

export const updateReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment } = req.body;

  // Find review
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  // Check authorization
  if (review.owner.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Logged in user is not allowed to make changes to the resource.",
        403
      )
    );
  }

  // Update & populate
  review = await Review.findByIdAndUpdate(
    req.params.id,
    { rating, comment },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  ).populate({
    path: "reviewedUser",
    select: "name ratings reviews",
    populate: {
      path: "reviews",
      select: "rating",
    },
  });

  // Update user ratings
  const reviewedUser = review.reviewedUser;
  let avg = 0;
  reviewedUser.reviews.forEach((review) => (avg += review.rating));
  reviewedUser.ratings = avg / reviewedUser.reviews.length;

  // Save changes
  await reviewedUser.save();

  res.status(200).json({
    success: true,
    review,
  });
});

export const deleteReview = catchAsyncErrors(async (req, res, next) => {
  // Find review
  let review = await Review.findById(req.params.id)
    .populate("owner")
    .populate("reviewedUser");

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  if (review.owner._id.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Logged in user is not allowed to make changes to the resource.",
        403
      )
    );
  }

  const owner = review.owner;
  const reviewedUser = review.reviewedUser;

  // Update references and counters
  owner.reviewed.pull(review._id);
  reviewedUser.reviews.pull(review._id);
  owner.numOfReviewed = owner.reviewed.length;
  reviewedUser.numOfReviews = reviewedUser.reviews.length;

  // Populate reviews field without the review to calc
  await reviewedUser.populate({
    path: "reviews",
    select: "rating",
  });

  // Calc average rating
  if (reviewedUser.reviews.length > 0) {
    let avg = 0;
    reviewedUser.reviews.forEach((review) => (avg += review.rating));
    console.log(reviewedUser)
    reviewedUser.ratings = avg / reviewedUser.reviews.length;
    console.log(reviewedUser.ratings)
  } else {
    reviewedUser.ratings = 0;
  }

  // Save changes
  await Promise.all([owner.save(), reviewedUser.save()]);

  // Delete
  await Review.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Review deleted.",
  });
});

export const getReviewDetails = catchAsyncErrors(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  res.status(200).json({
    success: true,
    review,
  });
});

// Admin
export const getAllReviews = catchAsyncErrors(async (req, res, next) => {
  const reviews = await Review.find();

  res.status(200).json({
    success: true,
    reviews,
  });
});

// Admin
export const deleteReviewWithId = catchAsyncErrors(async (req, res, next) => {
  // Find review
  let review = await Review.findById(req.params.id)
    .populate("owner")
    .populate("reviewedUser");

  if (!review) {
    return next(new ErrorHandler("Review not found.", 404));
  }

  const owner = review.owner;
  const reviewedUser = review.reviewedUser;

  // Update references and counters
  owner.reviewed.pull(review._id);
  reviewedUser.reviews.pull(review._id);
  owner.numOfReviewed = owner.reviewed.length;
  reviewedUser.numOfReviews = reviewedUser.reviews.length;

  // Populate reviews field without the review to calc
  await reviewedUser.populate({
    path: "reviews",
    select: "rating",
  });

  // Calc average rating
  if (reviewedUser.reviews.length > 0) {
    let avg = 0;
    reviewedUser.reviews.forEach((review) => (avg += review.rating));
    console.log(reviewedUser)
    reviewedUser.ratings = avg / reviewedUser.reviews.length;
    console.log(reviewedUser.ratings)
  } else {
    reviewedUser.ratings = 0;
  }

  // Save changes
  await Promise.all([owner.save(), reviewedUser.save()]);

  // Delete
  await Review.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Review deleted.",
  });
});
