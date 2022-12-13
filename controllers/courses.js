import asyncHandler from "../middleware/async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import Course from "../models/course.js";
import bootcamp from "../models/Bootcamps.js";

// @desc     GET all Courses
// @route    GET api/v1/Courses
// @route    GET api/v1/bootcamps/:bootcampId/courses
// @access   public
export const getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({
      bootcamp: req.params.bootcampId,
    });
    return res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @desc     GET single Course
// @route    GET api/v1/Courses/:id
// @access   public
export const getCourse = asyncHandler(async (req, res, next) => {
  const data = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!data) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  res.status(200).json({
    success: true,
    data,
  });
});
// @desc     ADD Course
// @route    POST api/v1/bootcamps/:bootcampId/courses
// @access   Private
export const addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const data = await bootcamp.findById(req.params.bootcampId);

  if (!data) {
    return next(
      new ErrorResponse(`No bootcamp with id of ${req.params.bootcampId}`),
      404
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} don't have access to edit ${data.title} course`,
        401
      )
    );
  }

  const course = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: course,
  });
});
// @desc     Update Course
// @route    PUT api/v1/courses/:id
// @access   Private
export const updateCourse = asyncHandler(async (req, res, next) => {
  let data = await Course.findById(req.params.id);

  if (!data) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} don't have access to edit ${data.title} course`,
        401
      )
    );
  }

  data = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data,
  });
});
// @desc     Delete Course
// @route    DELETE api/v1/courses/:id
// @access   Private
export const deleteCourse = asyncHandler(async (req, res, next) => {
  let data = await Course.findById(req.params.id);

  if (!data) {
    return next(
      new ErrorResponse(`No course with id of ${req.params.id}`),
      404
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} don't have access to edit ${data.title} course`,
        401
      )
    );
  }

  await data.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
