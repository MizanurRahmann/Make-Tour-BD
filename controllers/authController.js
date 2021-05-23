const { promisify } = require('util');
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Sign a new token for specific user id
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Sign up functionality
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create(req.body);

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// Login functionality
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email & password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  // 2) Check if user is exist && password is correct
  const user = await User.findOne({ email: email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// PROTECTING ROUTES
exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of its there
  let token;
  if ( req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if(!token) {
    return next(new AppError('Please log in to access.', 401));
  }
  
  // 2) Verification token
  // const decoded = promisify(jwt.verify)(token, process.env.JWT_SECRET); (complex procedure 😤 )
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);

  // 3) Check if user still exits
  const freshUser = await User.findById(decoded.id);
  if(!freshUser) {
    return next(new AppError('The user belonging to this token does no longer exist.', 401));
  }

  // 4) Check if user changed password after the token was issued
  if(freshUser.changePasswordAfter(decoded.iat)){
    return next(
      new AppError('User recently changed password. Please login again.', 401)
    );
  }

  // 5) Grant access to protected route
  req.user = freshUser;

  next();
});


// RESTRITCT ROUTES
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return next(new AppError('You do not have permission to perform this action.', 403))
    }
    next();
  };
};
