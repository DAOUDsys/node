import express from "express";
import User from "../models/user.js";
import { protect, authorize } from "../middleware/auth.js";
import advancedResults from "../middleware/advanced_results.js";
import {
  createUser,
  deleteUser,
  updateUser,
  getAllUsers,
  getUser,
} from "../controllers/user.js";

const userRouter = express.Router();

userRouter.use(protect);
userRouter.use(authorize("admin"));

userRouter.route("/").get(advancedResults(User), getAllUsers).post(createUser);
userRouter.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

export default userRouter;
