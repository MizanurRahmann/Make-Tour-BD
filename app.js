const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const tours = JSON.parse(
    fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

const getAllTours = (req, res) => {
    res.status(200).json({
        status: "success",
        data: {
            tours,
        },
    });
};

const getTour = (req, res) => {
    const id = req.params.id * 1;
    const tour = tours.find((el) => el.id === id);

    if (!tour) {
        res.status(404).json({
            status: "fail",
            message: "Invalid ID.",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            tour,
        },
    });
};

const createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1;
    const newTour = Object.assign({ id: newId }, req.body);
    tours.push(newTour);

    fs.writeFile(
        `${__dirname}/dev-data/data/tours-simple.json`,
        JSON.stringify(tours),
        (err) => {
            res.status(201).json({
                status: "success",
                data: {
                    tour: newTour,
                },
            });
        }
    );
};

const updateTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID.",
        });
    }

    res.status(200).json({
        status: "success",
        data: {
            tour: "Updated tour here </>",
        },
    });
};

const deleteTour = (req, res) => {
    if (req.params.id * 1 > tours.length) {
        return res.status(404).json({
            status: "fail",
            message: "Invalid ID.",
        });
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
};

const gettAllUsers = (req, res) => {
    res.status(500).json({
        status: "fail",
        message: "This route is not yet defined",
    });
};

const gettUser = (req, res) => {
    res.status(500).json({
        status: "fail",
        message: "This route is not yet defined",
    });
};

const createUser = (req, res) => {
    res.status(500).json({
        status: "fail",
        message: "This route is not yet defined",
    });
};

const updateUser = (req, res) => {
    res.status(500).json({
        status: "fail",
        message: "This route is not yet defined",
    });
};

const deleteUser = (req, res) => {
    res.status(500).json({
        status: "fail",
        message: "This route is not yet defined",
    });
};

// TOUR ROUTES
app.route("/api/v1/tours").get(getAllTours).post(createTour);
app.route("/api/v1/tours/:id")
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

// USER ROUTES
app.route("/api/v1/tours").get(gettAllUsers).post(createUser);
app.route("/api/v1/tours/:id")
    .get(gettUser)
    .patch(updateUser)
    .delete(deleteUser);

const port = 8000;
app.listen(port, () => {
    console.log(`App running on port ${port}.`);
});
