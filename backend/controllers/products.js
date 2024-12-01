import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Product from "../models/Product.js";
import ApiFeatures from "../utils/apifeatures.js";
import ErrorHandler from "../utils/errorhandler.js";

export const createProduct = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.create({ ...req.body, ...{user: req.user._id} });

  res.status(201).json({
    success: true,
    product,
  });
});

export const getAllProducts = catchAsyncErrors(async (req, res, next) => {
  // Perhaps add text indexing?

  const resultsPerPage = 5;
  const productCount = await Product.countDocuments();

  const apifeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter()
    .pagination(resultsPerPage);
  const products = await apifeature.query;

  res.status(200).json({
    success: true,
    products,
    productCount,
  });
});

export const updateProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  if (product.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to make changes to the resource.", 403));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    product,
  });
});

export const deleteProduct = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  if (product.user.toString() !== req.user._id.toString()) {
    return next(new ErrorHandler("Logged in user is not allowed to make changes to the resource.", 403));
  }

  await Product.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Product deleted.",
  });
});

export const getProductDetails = catchAsyncErrors(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  res.status(200).json({
    success: true,
    product,
  });
});
