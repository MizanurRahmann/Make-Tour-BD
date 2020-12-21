const express = require("express");
const userController = require("../controllers/userControllers");

const userRouters = express.Router();

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
