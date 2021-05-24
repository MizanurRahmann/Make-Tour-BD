const express = require("express");
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authController");

const userRouters = express.Router();

userRouters.post("/signup", authController.signup);
userRouters.post("/login", authController.login);

userRouters.post("/forgotPassword", authController.forgotPassword);
userRouters.patch("/resetPassword/:token", authController.resetPassword);
userRouters.patch(
  "/updatePassword",
  authController.protect,
  authController.updatePassword
);
userRouters.patch(
  "/updateMe",
  authController.protect,
  userController.updateMe
);
userRouters.patch(
  "/deleteMe",
  authController.protect,
  userController.deleteMe
);

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
