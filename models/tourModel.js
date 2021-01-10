const mongoose = require("mongoose");

const tourSchema = mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: [true, "A tour must have a name"],
    },
    ratting: {
        type: Number,
        default: 4.5,
    },
    price: {
        type: Number,
        required: [true, "A tour must have price"],
    },
});

const Tour = mongoose.model("Tour", tourSchema);

module.exports = Tour;
