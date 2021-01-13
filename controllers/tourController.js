const Tour = require("../models/tourModel");

// CREATE ALL TOURS
exports.getAllTours = async (req, res) => {
    try {
        // Build the quiery (filtering)
        const queryObj = { ...req.query };
        const excludeFields = ["page", "sort", "limit", "fields"];
        excludeFields.forEach((el) => delete queryObj[el]);

        // Build the query (advanced filtering)
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );

        // Execute query
        let query = Tour.find(JSON.parse(queryStr));

        // Exclude Obj
        const tours = await query;

        // Send Responce
        res.status(200).json({
            status: "success",
            results: tours.length,
            data: {
                tours,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

// GET A TOUR
exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id);

        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(404).json({
            status: "fail",
            message: err,
        });
    }
};

// CREATE A TOUR
exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                tour: newTour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: err,
        });
    }
};

// UPDATE A TOUR:
exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        res.status(200).json({
            status: "success",
            data: {
                tour,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Invalid Data Sent!",
        });
    }
};

// DELETE A TOUR:
exports.deleteTour = async (req, res) => {
    try {
        await Tour.findByIdAndDelete(req.params.id);

        res.status(200).json({
            status: "success",
            data: null,
        });
    } catch (err) {
        res.status(400).json({
            status: "fail",
            message: "Invalid Data Sent!",
        });
    }
};
