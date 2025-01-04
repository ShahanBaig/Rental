import mongoose from "mongoose";

const rentalSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },

  lenderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  renterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  duration: {
    anticipated: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    actual: {
      start: { type: Date },
      end: { type: Date },
    },
    cooldownExpiry: { type: Date, required: true },
    days: {
      type: Number,
      min: [1, "Duration must be at least 1 day."],
      max: [366, "Duration cannot exceed 1 year."],
    },
  },

  payment: [
    {
      type: {
        type: String,
        enum: [
          "rented",
          "extended",
          "reduced",
          "rescheduled",
          "late fee",
          "security Deposit",
          "cancellation fee",
          "refund",
        ],
        required: true,
      },
      method: {
        type: String,
        required: true,
      },
      amount: { type: Number, required: true },
      status: {
        type: String,
        enum: [
          "pending",
          "active",
          "completed - holding security deposit", // Completed, deposit held
          "completed", // Fully completed
          "refunded", // Refunded rental
          "canceled", // Canceled rental
          "disputed", // Under dispute
          "payment failed", // Payment issues
          "overdue", // Rental overdue
          "terminated", // Rental forcibly ended
        ],
        default: "pending",
      },
      transactionId: { type: Number, required: true },
      paidAt: { type: Date },
      refundedAt: { type: Date },
    },
  ],

  conditionPictures: {
    renter: {
      before: [{ type: String }], // Pictures provided by renter before rental
      after: [{ type: String }], // Pictures provided by renter after rental
    },
    lender: {
      before: [{ type: String }], // Pictures provided by lender before rental
      after: [{ type: String }], // Pictures provided by lender after rental
    },
  },

  status: {
    type: String,
    enum: [
      "pending", // Renter has requested to rent the product.
      "confirmed",
      "denied",
      "ongoing", // Rental period is active, and the product is with the renter.
      "completed", // Rental is completed and returned.
      "payment issues",

      "rescheduling pending",
      "rescheduling denied",
      "rescheduling confirmed",
      "rescheduling failed - payment issues",
      "late return", // Product return is overdue.
      "dispute", // A dispute has been raised (e.g., damages, late fees).
      "cancelled", // Rental was cancelled by the renter before approval or start.
      "in review", // The rental is under review due to complaints or claims.
    ],
    default: "pending",
  },

  rescheduling: {
    isRequested: { type: Boolean, default: false },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    newDuration: {
      start: { type: Date },
      end: { type: Date },
      cooldownExpiry: { type: Date },
      days: {
        type: Number,
        min: [1, "Duration must be at least 1 day."],
        max: [366, "Duration cannot exceed 1 year."],
      },
    },
    action: {
      type: String,
      enum: ["extended", "reduced", "rescheduled"],
    },
    requestedAt: { type: Date },
    respondedAt: { type: Date },
  },

  dispute: {
    isDisputed: { type: Boolean, default: false },
    reason: { type: String },
    resolution: { type: String },
    disputeTimestamp: { type: Date },
  },

  cancellation: {
    isCancelled: { type: Boolean, default: false },
    reason: { type: String },
    cancelledBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    cancelledOn: { type: Date },
  },

  timestamps: {
    confirmationHandledAt: {
      type: Date,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    expiresAt: {
      type: Date,
      default: function () {
        return new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day from creation
      },
      index: { expires: 0 },
    },
  },
});

// Calculate dates
rentalSchema.statics.calculateAnticipatedDates = function (
  anticipatedStart,
  days,
  cooldownPeriodInHours
) {
  const start = new Date(anticipatedStart);
  const end = new Date(
    new Date(anticipatedStart).setDate(
      new Date(anticipatedStart).getDate() + days
    )
  ).toISOString();
  const cooldownExpiry = new Date(
    new Date(
      new Date(anticipatedStart).setDate(
        new Date(anticipatedStart).getDate() + days
      )
    ).setHours(new Date(anticipatedStart).getHours() + cooldownPeriodInHours)
  ).toISOString();

  return { start, end, cooldownExpiry };
};

// Check if a new duration overlaps the current duration
rentalSchema.statics.checkForOverlappingRentals = async function (
  productId,
  startDate,
  cooldownExpiryDate
) {
  return await this.findOne({
    productId: productId,
    status: {
      $in: ["confirmed", "rescheduling confirmed", "ongoing", "completed"],
    },
    $or: [
      {
        "duration.anticipated.start": {
          $lt: cooldownExpiryDate,
          $gte: startDate,
        },
      },
      {
        "duration.cooldownExpiry": { $lt: cooldownExpiryDate, $gte: startDate },
      },
      {
        $and: [
          { "duration.anticipated.start": { $lte: startDate } },
          { "duration.cooldownExpiry": { $gte: cooldownExpiryDate } },
        ],
      },
    ],
  });
};

const Rental = mongoose.model("Rental", rentalSchema);

export default Rental;
