import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import Rental from "../models/Rental.js";
import ErrorHandler from "../utils/errorhandler.js";
import Product from "../models/Product.js";
import moment from "moment";

// Create rental request
export const createRental = catchAsyncErrors(async (req, res, next) => {
  // Body
  const { anticipatedStart, days } = req.body;

  // Cannot have more than request to rent a product
  let rental = await Rental.findOne({
    renterId: req.user.id.toString(),
    status: { $in: ["pending"] },
  });

  if (rental) {
    return next(
      new ErrorHandler(
        "You cannot have more than request to rent a product.",
        400
      )
    );
  }

  // Ensure renter has a valid payment option present
  const { banking } = req.user;
  if (
    !banking ||
    !banking.lastFourDigits ||
    !banking.cardBrand ||
    !banking.expirationDate
  ) {
    throw new ErrorHandler(
      "You must have a valid payment option setup before you can request to rent products.",
      400
    );
  }

  // Find Product
  const product = await Product.findById(req.params.productId);

  if (!product) {
    return next(new ErrorHandler("Product not found.", 404));
  }

  // Cannot create a rental request for your own product
  if (product.user.toString() === req.user.id.toString()) {
    return next(new ErrorHandler("You cannot rent your own product.", 400));
  }

  // Validate Dates
  if (!moment(anticipatedStart, moment.ISO_8601, true).isValid()) {
    return next(new ErrorHandler("Invalid date format provided.", 400));
  }

  // Calculate dates
  const dates = Rental.calculateAnticipatedDates(
    anticipatedStart,
    days,
    product.cooldownPeriodInHours
  );

  // Check for Overlapping Rentals
  const overlappingRental = await Rental.checkForOverlappingRentals(
    req.params.productId,
    dates.start,
    dates.cooldownExpiry
  );

  if (overlappingRental) {
    return next(
      new ErrorHandler("Product is already rented during this period.", 400)
    );
  }

  // Create rental
  rental = await Rental.create({
    productId: req.params.productId,
    lenderId: product.user,
    renterId: req.user._id,
    "duration.anticipated.start": dates.start,
    "duration.anticipated.end": dates.end,
    "duration.cooldownExpiry": dates.cooldownExpiry,
    "duration.days": days,
  });

  res.status(201).json({
    success: true,
    message: "Rental request submitted for approval.",
    rental,
  });
});

export const confirmRental = catchAsyncErrors(async (req, res, next) => {
  const rentalId = req.params.id;
  const { isApproved } = req.body;

  // Find rental by ID
  let rental = await Rental.findById(rentalId).populate([
    { path: "productId" },
    { path: "renterId" },
  ]);

  if (!rental) {
    return next(new ErrorHandler("Rental request not found.", 404));
  }

  // Check whether it is the owner of the rental who is confirming the request
  if (rental.lenderId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("Only the product owner can confirm the rental.", 403)
    );
  }

  // Ensure the rental is still pending
  if (rental.status !== "pending") {
    return next(
      new ErrorHandler(
        "Rental request is no longer pending, unable to confirm or deny.",
        400
      )
    );
  }

  // Calculate Total Price
  const securityDeposit = rental.productId.securityDepositAmount;
  const subTotal = rental.productId.price * rental.duration.days;
  const tax = subTotal * 0.05;
  const totalPrice = subTotal + tax + securityDeposit;

  // If denied
  if (!isApproved) {
    rental.status = "denied";
    rental.confirmationHandledAt = new Date();
    await rental.save();

    return res.status(200).json({
      success: true,
      message: "Rental request denied.",
      rental,
    });
  }

  // Process payment
  const payment = {
    status: "active",
    transactionId: 123456789,
    paidAt: Date.now(),
  };

  if (payment.status !== "active") {
    rental.status = "payment issues";
    (rental.expiresAt = null), await rental.save();
    return next(new ErrorHandler("Failed payment transaction.", 400));
  }

  // Update confirmation
  rental.status = "confirmed";
  rental.timestamps.confirmationHandledAt = new Date();
  rental.timestamps.expiresAt = null;
  rental.payment.push({
    type: "rented",
    method: rental.renterId.banking.cardBrand,
    amount: totalPrice,
    status: payment.status,
    transactionId: payment.transactionId,
    paidAt: payment.paidAt,
  });
  await rental.save();

  res.status(200).json({
    success: true,
    message: "Rental request confirmed.",
    rental,
  });
});

// Reschedule rental
export const requestReschedule = catchAsyncErrors(async (req, res, next) => {
  const { anticipatedStart, days } = req.body;

  // Find rental
  let rental = await Rental.findById(req.params.id).populate("productId");

  if (!rental) {
    return next(new ErrorHandler("Rental request not found.", 404));
  }

  // Check authorization
  if (rental.renterId.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Only the renter is allowed to reschedule rental requests.",
        403
      )
    );
  }

  // Can only have one reschedule request at a time
  if (rental.status === "rescheduling pending") {
    return next(
      new ErrorHandler(
        "You can only have one reschedule request active at a time.",
        404
      )
    );
  }

  // Can only be reschduled once the rental has been confirmed
  if (
    rental.status !== "confirmed" &&
    rental.status !== "rescheduling denied" &&
    rental.status !== "rescheduling confirmed"
  ) {
    return next(
      new ErrorHandler(
        "You cannot reschedule this rental request at this point.",
        404
      )
    );
  }

  // Validate Dates
  if (!moment(anticipatedStart, moment.ISO_8601, true).isValid()) {
    return next(new ErrorHandler("Invalid date format provided.", 400));
  }

  // Dates (*****Will need to add timezone support)
  const oldStartDate = new Date(rental.duration.anticipated.start);
  const oldEndDate = new Date(rental.duration.anticipated.end);
  const dates = Rental.calculateAnticipatedDates(
    anticipatedStart,
    days,
    rental.productId.cooldownPeriodInHours
  );

  // Check if the new rental period is the same as the previous one
  if (
    oldStartDate.toISOString() === dates.start.toISOString() &&
    oldEndDate.toISOString() === dates.end.toISOString()
  ) {
    return next(
      new ErrorHandler(
        "The new date is identical to the existing one. No update needed.",
        400
      )
    );
  }

  // Check for Overlapping Rentals
  const overlappingRental = await Rental.checkForOverlappingRentals(
    req.params.productId,
    dates.start,
    dates.cooldownExpiry
  );

  if (overlappingRental) {
    return next(
      new ErrorHandler("Product is already rented during this period.", 400)
    );
  }

  // Check if it is an extension, reduction or a reschedule
  let action;
  if (rental.duration.days < days) {
    action = "extended";
  } else if (rental.duration.days > days) {
    action = "reduced";
  } else {
    action = "rescheduled";
  }

  // Create the rescheduling request
  rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "rescheduling.isRequested": true,
        "rescheduling.requestedBy": req.user._id,
        "rescheduling.newDuration.start": dates.start,
        "rescheduling.newDuration.end": dates.end,
        "rescheduling.newDuration.cooldownExpiry": dates.cooldownExpiry,
        "rescheduling.newDuration.days": days,
        "rescheduling.action": action,
        status: "rescheduling pending",
        "rescheduling.requestedAt": new Date(),
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Rescheduling request submitted for approval.",
    rental,
  });
});

export const confirmReschedule = catchAsyncErrors(
  async (req, res, next) => {
    const rentalId = req.params.id;
    const { isApproved } = req.body;

    // Find rental
    const rental = await Rental.findById(rentalId).populate([
      { path: "productId" },
      { path: "renterId" },
    ]);

    if (!rental) {
      return next(new ErrorHandler("Rental not found.", 404));
    }

    // Ensure only the lender can approve/deny the request
    if (rental.lenderId.toString() !== req.user._id.toString()) {
      return next(
        new ErrorHandler(
          "Only the product owner can approve or deny rescheduling.",
          403
        )
      );
    }

    // Ensure there is a pending rescheduling request
    if (!rental.rescheduling.isRequested) {
      return next(
        new ErrorHandler("No pending rescheduling request found.", 400)
      );
    }

    // Ensure new duration is not less than paid days or more than a year.
    if (
      rental.rescheduling.newDuration.days < 0 ||
      rental.rescheduling.newDuration.days > 366
    ) {
      return next(new ErrorHandler("Duration must remain within bounds.", 400));
    }

    // If denied
    if (!isApproved) {
      rental.status = "rescheduling denied";
      rental.rescheduling.isRequested = false;
      rental.rescheduling.respondedAt = new Date();
      await rental.save();

      return res.status(200).json({
        success: true,
        message: "Rescheduling denied.",
        rental,
      });
    }

    const differenceInDays =
      rental.rescheduling.newDuration.days - rental.duration.days;

    if (differenceInDays !== 0) {
      // Calculate Total Price (Positive value for charge, negative for a refund)
      const subTotal = rental.productId.price * differenceInDays;
      const tax = subTotal * 0.05;
      const totalPrice = subTotal + tax;

      // Process payment
      const payment = {
        status: "active",
        transactionId: 123456789,
        paidAt: Date.now(),
      };

      if (payment.status !== "active") {
        rental.status = "rescheduling failed - payment issues";
        rental.rescheduling.isRequested = false;
        await rental.save();
        return next(new ErrorHandler("Failed payment transaction.", 400));
      }

      rental.payment.push({
        type: rental.rescheduling.action,
        method: rental.renterId.banking.cardBrand,
        amount: totalPrice,
        status: payment.status,
        transactionId: payment.transactionId,
        paidAt: payment.paidAt,
      });

      await rental.save();
    }

    // Update
    rental.status = "rescheduling confirmed";
    rental.rescheduling.isRequested = false;
    rental.rescheduling.respondedAt = new Date();
    rental.duration.anticipated.start = rental.rescheduling.newDuration.start;
    rental.duration.anticipated.end = rental.rescheduling.newDuration.end;
    rental.duration.cooldownExpiry =
      rental.rescheduling.newDuration.cooldownExpiry;
    rental.duration.days = rental.rescheduling.newDuration.days;
    await rental.save();

    res.status(200).json({
      success: true,
      message: "Rescheduling confirmed.",
      rental,
    });
  }
);

// Cancel rental request
export const cancelRental = catchAsyncErrors(async (req, res, next) => {
  const { reason } = req.body;

  // Find rental
  let rental = await Rental.findById(req.params.id);

  if (!rental) {
    return next(new ErrorHandler("Rental request not found.", 404));
  }

  // Check authorization
  if (
    rental.lenderId.toString() !== req.user._id.toString() &&
    rental.renterId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin"
  ) {
    return next(
      new ErrorHandler(
        "Logged in user is not allowed to make changes to the resource.",
        403
      )
    );
  }

  // Check change is being performed before a certain status
  if (rental.status !== "pending") {
    return next(
      new ErrorHandler("This rental can no longer be canceled.", 400)
    );
  }

  // Ensure it has not already been cancelled
  if (rental.cancellation.isCancelled) {
    return next(
      new ErrorHandler("Rental request has already been cancelled.", 400)
    );
  }

  // Refund party and charge cancellation fee (Currently only allowed to cancel during pending stage.)

  // Update & populate
  rental = await Rental.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "cancellation.isCancelled": true,
        "cancellation.reason": reason,
        "cancellation.cancelledBy": req.user._id,
        "cancellation.cancelledOn": Date.now(),
        status: "cancelled",
      },
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
    message: "Rental request cancelled.",
    rental
  });
});

// Reads
export const externalRentals = catchAsyncErrors(
  async (req, res, next) => {
    let rentals = await Rental.find({ renterId: req.user._id }).populate(
      "productId"
    );

    if (!rentals) {
      return next(new ErrorHandler("You have no rental requests.", 404));
    }

    res.status(200).json({
      success: true,
      message: "Retrieved rental requests created by you.",
      rentals,
    });
  }
);

export const internalRentals = catchAsyncErrors(
  async (req, res, next) => {
    let rentals = await Rental.find({ lenderId: req.user._id }).populate(
      "productId"
    );

    if (!rentals) {
      return next(
        new ErrorHandler("You have no rental requests for your products.", 404)
      );
    }

    res.status(200).json({
      success: true,
      message: "Retrieved rental requests for your products.",
      rentals,
    });
  }
);

export const getRentalDetails = catchAsyncErrors(async (req, res, next) => {
  let rental = await Rental.findById(req.params.id).populate(
    "renterId",
    "name email"
  );

  if (!rental) {
    return next(new ErrorHandler("Rental request not found.", 404));
  }

  res.status(200).json({
    success: true,
    message: "Retrieved rental details.",
    rental,
  });
});

// Admin routes
export const getAllRentals = catchAsyncErrors(async (req, res, next) => {
  const rentals = await Rental.find();

  res.status(200).json({
    success: true,
    message: "Retrieved all rentals.",
    rentals,
  });
});

export const deleteRental = catchAsyncErrors(async (req, res, next) => {
  // Find rental
  let rental = await Rental.findById(req.params.id);

  if (!rental) {
    return next(new ErrorHandler("Rental request not found.", 404));
  }

  // Delete
  await Rental.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    message: "Rental request deleted.",
  });
});


// export const updatePictures = catchAsyncErrors(async (req, res, next) => {
//   const { rating, comment } = req.body;

//   // Find rental
//   let rental = await Rental.findById(req.params.id);

//   if (!rental) {
//     return next(new ErrorHandler("Rental request not found.", 404));
//   }

//   // Check authorization
//   if (
//     rental.lenderId.toString() !== req.user._id.toString() &&
//     rental.renterId.toString() !== req.user._id.toString()
//   ) {
//     return next(
//       new ErrorHandler(
//         "Logged in user is not allowed to make changes to the resource.",
//         403
//       )
//     );
//   }

//   // Check change is being performed before a certain status

//   // Update & populate
//   rental = await Rental.findByIdAndUpdate(
//     req.params.id,
//     { rating, comment },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

//   res.status(200).json({
//     success: true,
//     rental,
//   });
// });

// export const updateDispute = catchAsyncErrors(async (req, res, next) => {
//   const { message } = req.body;

//   // Find rental
//   let rental = await Rental.findById(req.params.id);

//   if (!rental) {
//     return next(new ErrorHandler("Rental request not found.", 404));
//   }

//   // Check authorization
//   if (
//     rental.lenderId.toString() !== req.user._id.toString() &&
//     rental.renterId.toString() !== req.user._id.toString()
//   ) {
//     return next(
//       new ErrorHandler(
//         "Logged in user is not allowed to make changes to the resource.",
//         403
//       )
//     );
//   }

//   // Check change is being performed before a certain status

//   // Update & populate
//   rental = await Rental.findByIdAndUpdate(
//     req.params.id,
//     { rating, comment },
//     {
//       new: true,
//       runValidators: true,
//       useFindAndModify: false,
//     }
//   );

//   res.status(200).json({
//     success: true,
//     rental,
//   });
// });
