const express = require("express");
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authController");

const userRouters = express.Router();

userRouters.post("/signup", authController.signup);

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
