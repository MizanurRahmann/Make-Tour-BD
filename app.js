const express = require("express");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouters = require("./routers/tourRouters");
const userRouters = require("./routers/userRouters");

// MIDDLEWARE
const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTERS
app.use("/api/v1/tours", tourRouters);
app.use("/api/v1/users", userRouters);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// GLOBAL ERROR HANDLING MIDDLEWARE
app.use(globalErrorHandler);

module.exports = app;
