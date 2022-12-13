import asyncHandler from "../middleware/async.js";
import User from "../models/user.js";

// @desc     Get all users
// @route    GET api/v1/auth/users
// @access   Privet-Admin
export const getAllUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});
// @desc     Get single user
// @route    GET api/v1/auth/users/:id
// @access   Privet-Admin
export const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({ success: true, data: user });
});
// @desc     Create new user
// @route    POST api/v1/auth/users/
// @access   Privet-Admin
export const createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({ success: true, data: user });
});
// @desc     Update user
// @route    PUT api/v1/auth/users/:id
// @access   Privet-Admin
export const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: user });
});
// @desc     Delete user
// @route    DELETE api/v1/auth/users/:id
// @access   Privet-Admin
export const deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(201).json({ success: true, data: {} });
});
