const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "A tour must have a name"],
        trim: true,
    },
    duration: {
        type: Number,
        required: [true, "A tour have a duration"],
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulties."],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"],
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"],
    },
    priceDiscount: Number,
    ratingsAverage: {
        type: Number,
        default: 4.5,
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
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
