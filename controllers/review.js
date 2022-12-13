import asyncHandler from "../middleware/async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import Review from "../models/review.js";
import bootcamp from "../models/Bootcamps.js";
import Course from "../models/course.js";

// @desc     GET all reviews
// @route    GET api/v1/reviews
// @route    GET api/v1/bootcamps/:bootcampId/reviews
// @access   public
export const getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({
      bootcamp: req.params.bootcampId,
    });
    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});
// @desc     GET single reviews
// @route    GET api/v1/reviews/:id
// @access   public
export const getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });
  if (!review) {
    return next(
      new ErrorResponse(`the is no review have ${req.params.id} id`, 404)
    );
  }
  res.status(200).json({ success: true, data: review });
});
// @desc     Add review
// @route    POST api/v1/:bootcampId/reviews
// @access   Privet
export const addReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcampCheck = await bootcamp.findById(req.params.bootcampId);

  if (!bootcampCheck) {
    return next(
      new ErrorResponse(
        `there is no bootcamp have ${req.params.bootcampId} id`,
        404
      )
    );
  }

  const review = await Review.create(req.body);

  res.status(200).json({ success: true, data: review });
});
// @desc     Update review
// @route    PUT api/v1/reviews/:id
// @access   Privet
export const updateReview = asyncHandler(async (req, res, next) => {
  let review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`there is no review with ${req.params.id} id`, 404)
    );
  }

  // make sure the review belongs to the user or user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`the user doesn't have access to edit this review`, 401)
    );
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: review });
});
// @desc     Delete review
// @route    DELETE api/v1/reviews/:id
// @access   Privet
export const deleteReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(
      new ErrorResponse(`there is no review with ${req.params.id} id`, 404)
    );
  }

  // make sure the review belongs to the user or user is an admin
  if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`the user doesn't have access to edit this review`, 401)
    );
  }

  await review.remove();

  res.status(200).json({ success: true, data: {} });
});
