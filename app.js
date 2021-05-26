const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouters = require("./routers/tourRouters");
const userRouters = require("./routers/userRouters");

// ------- MIDDLEWARES ----------
const app = express();
// security http headers
app.use(helmet())
// security rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour.',
});
app.use('/api',limiter);
// body perser, reading data from body into req.body
app.use(express.json());
// serving static files
app.use(express.static(`${__dirname}/public`));

// ---------- ROUTERS ----------
app.use("/api/v1/tours", tourRouters);
app.use("/api/v1/users", userRouters);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server.`, 404));
});

// ---------- GLOBAL ERROR HANDLING MIDDLEWARE ----------
app.use(globalErrorHandler);

module.exports = app;
