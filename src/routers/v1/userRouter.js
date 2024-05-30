const express = require("express");
const userController = require("../../controllers/userController");
const { kiemTraToken } = require("../../middlewares/auth");

const userRouter = express.Router();

userRouter.get("/getUser", userController.getUser);
userRouter.get("/getUserId/:id", userController.getUserId);
userRouter.get("/searchByName/:hoTen", userController.searchByName);
userRouter.post("/createUser", kiemTraToken, userController.createUser);
userRouter.put("/updateUser/:id", kiemTraToken, userController.updateUser);
userRouter.delete("/deleteUser/:id", kiemTraToken, userController.deleteUser);

// Post sign up
userRouter.post("/signUp", userController.signUp);
// Post login
userRouter.post("/login", userController.login);

module.exports = userRouter;
