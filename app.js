const express = require("express");

const tourRouters = require("./routers/tourRouters");
const userRouters = require("./routers/userRouters");

// MIDDLEWARE
const app = express();
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// ROUTERS
app.use("/api/v1/tours", tourRouters);
app.use("/api/v1/users", userRouters);

app.all('*', (req, res, next) => {
    res.status(404).json({
        status: 'fail',
        message: `Can't find ${req.originalUrl} on this server.`
    })
})

module.exports = app;
