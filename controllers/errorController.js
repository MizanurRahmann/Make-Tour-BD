const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  const message = `Duplicate field value ${value}. Please another value`;
  return new AppError(message, 400);
};

const handleJWTerror = (err) => {
  return new AppError('Invalid token. Please login again', 401);
};

const handleTokenExperedError = (err) => {
  return new AppError('Session Expired. Please login again.', 401);
}

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

  // Proggramming or other unknown error: don't leak error details
  } else {
    console.log('ERROR 💥 ');
    res.status(500).json({
      status: "error",
      message: "Something went very wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err, res);
  } else if(process.env.NODE_ENV === 'production'){
    let error = {...err};
    
    // Invalid database id (Cast error)
    if(err.name === 'CastError') error = handleCastErrorDB(error);
    // Mongoode validation Error (Validation error)
    if(err.name === 'ValidationError') error = handleValidationErrorDB(error);
    // Duplicate Database fields
    if(err.code === 11000) error = handleDuplicateFieldsDB(error);
    // JSON WEB TOKEN ERROR
    if(err.name === 'JsonWebTokenError') error = handleJWTerror(error);
    // Toke Expired error
    if(err.name === 'TokenExpiredError') error = handleTokenExperedError(error);
    
    console.log(err);
    sendErrorProd(error, res);
  }
};
 