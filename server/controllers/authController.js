const User = require("../models/user");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");
const sendmail = require("../utils/nodemailer");

exports.verify = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("User not found", 404));
  }
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "User verified successfully",
  });
});

exports.signup = catchAsync(async (req, res) => {
  const { name, email, password, phone, photo } = req.body;
  const newUser = await User.create({
    name,
    email,
    password,
    phone,
    photo,
  });
  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.correctPassword(password, user.password))) {
    return res.status(401).json({
      status: "fail",
      message: "Incorrect email or password",
    });
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError("There is no user with this email address", 404));
  }
  const resetToken = user.createpasswordresetpassword();
  await user.save({ validateBeforeSave: false });

  // send token to mail

  const message = `Forgot your password? Submit this ${resetToken} token with your new password.\nIf you didn't forget your password, please ignore this email!`;

  await sendmail({
    email: user.email,
    subject: "Your password reset token (valid for 10 min)",
    message,
  });

  res.status(200).json({
    status: "success",
    message: "Token sent to email!",
  });
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { token, password } = req.body;
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save({ validateBeforeSave: false });
  res.status(200).json({
    status: "success",
    message: "Password reset successfully login with new password",
  });
});
