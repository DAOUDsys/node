import bootcamp from "../models/Bootcamps.js";
import asyncHandler from "../middleware/async.js";
import { ErrorResponse } from "../utils/errorResponse.js";
import geocoder from "../utils/geocoder.js";
import path from "path";

// @desc     GET all bootcamps
// @route    GET api/v1/bootcamps
// @access   public
export const getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // add user to req.body
  req.body.user = req.user.id;

  // check for published bootcamp
  const publishedBootcamp = await bootcamp.findOne({ user: req.user.id });

  // if the user is not an admin, they can only add one bootcamp
  if (publishedBootcamp && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} has already published a bootcamp`,
        400
      )
    );
  }

  const data = await bootcamp.create(req.body);
  res.status(201).json({ success: true, data: data });
});

// @desc     update new bootcamp
// @route    PUT api/v1/bootcamps/:id
// @access   private
export const updateBootcamp = asyncHandler(async (req, res, next) => {
  let data = await bootcamp.findById(req.params.id);
  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.params.id} don't have access to edit ${data.name} bootcamp`,
        401
      )
    );
  }

  data = await bootcamp.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({ success: true, data: data });
});
// @desc     delete bootcamp
// @route    DELETE api/v1/bootcamps/:id
// @access   private
export const deleteBootcamp = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.findById(req.params.id);
  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} don't have access to edit ${data.name} bootcamp`,
        401
      )
    );
  }

  data.remove();
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
// @desc     Upload photo for bootcamp
// @route    DELETE api/v1/bootcamps/:id/photo
// @access   private
export const bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  const data = await bootcamp.findById(req.params.id);
  if (!data) {
    return next(
      new ErrorResponse(`Resource not found with id of ${req.params.id}`)
    );
  }

  // make sure user is bootcamp owner
  if (data.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `the user with id ${req.user.id} don't have access to edit ${data.name} bootcamp`,
        401
      )
    );
  }
  
  if (!req.files) {
    return next(new ErrorResponse("please upload a file", 400));
  }

  const file = req.files.file;

  // make sure the image is a photo
  if (!file.mimetype.startsWith("image")) {
    return next(new ErrorResponse(`please upload an image file`, 400));
  }

  // check file size
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(`please upload an image file lis than 1MB`, 400)
    );
  }

  // create custom file name
  file.name = `photo_${req.params.id}${path.parse(file.name).ext}`;

  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.log(err);
      return next(new ErrorResponse(`problem with file upload`, 400));
    }
    await bootcamp.findByIdAndUpdate(req.params.id, {
      photo: file.name,
    });

    res.status(200).json({
      success: true,
      data: file.name,
    });
  });
});
