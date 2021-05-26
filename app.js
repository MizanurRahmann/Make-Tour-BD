const express = require("express");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const tourRouters = require("./routers/tourRouters");
const userRouters = require("./routers/userRouters");

// ------- MIDDLEWARES ----------
const app = express();
// security http headers
app.use(helmet());

// security rate limit
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour.",
});
app.use("/api", limiter);

// body perser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// data sanitization against NoSQL query injection
app.use(mongoSanitize());

// data sanitization against xss
app.use(xss());

// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      "duration",
      "price",
      "ratingsAverage",
      "maxGroupSize",
      "difficulty",
      "price",
    ],
  })
);

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
