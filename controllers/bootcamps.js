import bootcamp from "../models/Bootcamps.js";
import asyncHandler from "../middleware/async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import geocoder from "../utils/geocoder.js";

// @desc     GET all bootcamps
// @route    GET api/v1/bootcamps
// @access   public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  let queryStr = JSON.stringify(req.query);
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  const data = await bootcamp.find(JSON.parse(queryStr));
  res.status(200).json({ success: true, count: data.length, data: data });
});

// @desc     GET single bootcamp
// @route    GET api/v1/bootcamps/:id
// @access   public
export const getBootcamp = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.findById(req.params.id);

  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: data });
});

// @desc     create new bootcamp
// @route    POST api/v1/bootcamps
// @access   private
export const createBootcamp = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.create(req.body);
  res.status(201).json({ success: true, data: data });
});

// @desc     update new bootcamp
// @route    PUT api/v1/bootcamps/:id
// @access   private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  res.status(200).json({ success: true, data: data });
});

// @desc     delete bootcamp
// @route    DELETE api/v1/bootcamps/:id
// @access   private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.findByIdAndDelete(req.params.id);
  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }
  res.status(200).json({ success: true, data: {} });
});
// @desc     GET bootcamp within a radius
// @route    DELETE api/v1/bootcamps/radius/:zipcode/:distance
// @access   private
export const getBootcampByRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //  get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // calc radius using radians
  // divide distance by radius of earth
  // earth radius = 6378 km
  const radius = distance / 6378;
  const bootcamps = await bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });
  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
