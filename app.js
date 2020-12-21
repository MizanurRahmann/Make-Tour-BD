const express = require("express");

const tourRouters = require("./routers/tourRouters");
const userRouters = require("./routers/userRouters");

// MIDDLEWARE
const app = express();
app.use(express.json());

// ROUTERS
app.use("/api/v1/tours", tourRouters);
app.use("/api/v1/users", userRouters);

module.exports = app;
