const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/email");

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

// FORGOT PASSWORD FUNCTIONALITY
exports.forgotPassword = async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({email: req.body.email});
  if(!user) {
    return next(new AppError('There is no user with this email address.', 404));
  }

  // 2) Generate the random token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // 3) Send to user email
  const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n If you didn't forgot your password, please ignore this email.`

  try{
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10min).',
      message
    });
  
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email.'
    });
  } catch (err){
    user.passwordResetToken = undefined;
    user.passwordResetExpire = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError('There was an error sending the email. Try again later!'));
  }
}

// RESET PASSWORD FUNCTIONALITY
exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hasedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ 
    passwordResetToken: hasedToken,
    passwordResetExpire: {$gte: Date.now()}
  });

  // 2) If token has not expired, and there is user, set the password
  if(!user){
    return next(new AppError('Token is invalid or has expired.', 400));
  }
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;
  await user.save();

  // 3) Log the user in, send JWT
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

// UPDATE PASSWORD FUNCTIONALITY
exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTed current password is correct
  if(!(await user.correctPassword(req.body.currentPassword, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  await user.save();

  // 4) Log user in, send JWT
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
