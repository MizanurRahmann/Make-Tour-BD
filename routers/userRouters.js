const express = require("express");
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authController");

const userRouters = express.Router();

userRouters.post("/signup", authController.signup);
userRouters.post("/login", authController.login);
userRouters.post("/forgotPassword", authController.forgotPassword);
userRouters.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
userRouters.use(authController.protect);

userRouters.patch("/updatePassword", authController.updatePassword);
userRouters.patch("/updateMe", userController.updateMe);
userRouters.delete("/deleteMe", userController.deleteMe);

// Protect these routes only for admin after this middleware
userRouters.use(authController.restrictTo("admin"));

userRouters
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

userRouters
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouters;
