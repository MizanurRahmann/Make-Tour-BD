const mongoose = require("mongoose");
const slugify = require("slugify");
const User = require("./userModel");

const tourSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      trim: true,
      unique: true,
      maxlength: [
        40,
        "A tour name must have less or equal than 40 characters.",
      ],
      minlength: [
        10,
        "A tour name must have more or equal than 10 characters.",
      ],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, "A tour have a duration"],
    },
    difficulty: {
      type: String,
      required: [true, "A tour must have a difficulties."],
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficultiy is either easy, medium or difficult.",
      },
    },
    maxGroupSize: {
      type: Number,
      required: [true, "A tour must have a group size"],
    },
    price: {
      type: Number,
      required: [true, "A tour must have a price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          // this only pints to current doc on NEW document creation.
          return val < this.price;
        },
        message: "Discount price ({VALUE}) should be below regular price.",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0."],
      max: [5, "Rating must be below 5.0."],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    summary: {
      type: String,
      trim: true,
      required: [true, "A tour must have a description"],
    },
    description: {
      type: String,
      trim: true,
    },
    imageCover: {
      type: String,
      required: [true, "A tour must have a image"],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: "Point",
        enaum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enaum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: Array,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

// DOCUMENT MIDDLEWARE:
// runs before .save() and .create()
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

tourSchema.pre("save", async function(next) {
    const guidePromises = this.guides.map(async id => await User.findById(id));
    this.guides = await Promise.all(guidePromises);
    next();
})

// QUERY MIDDLEWARE:
// Secrete tours are not show
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query tooks ${Date.now() - this.start} milliseconds.`);
  next();
});

// AGGREGATION MIDDLEWARE:
// not include secrete tours..
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
