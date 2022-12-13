import express from "express";
import coursesRouter from "./courses.route.js";
import advancedResults from "../middleware/advanced_results.js";
import bootcamp from "../models/Bootcamps.js";
import { authorize, protect } from "../middleware/auth.js";
import {
  getBootcamps,
  getBootcamp,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampByRadius,
  bootcampPhotoUpload,
} from "../controllers/bootcamps.js";
import reviewRouter from './review.route.js';

const bootcampRouter = express.Router();

// Re-route into other resource router
bootcampRouter.use("/:bootcampId/courses", coursesRouter);
bootcampRouter.use("/:bootcampId/reviews", reviewRouter);

bootcampRouter
  .route("/")
  .get(advancedResults(bootcamp, "courses"), getBootcamps)
  .post(protect, authorize('publisher', 'admin'), createBootcamp);
bootcampRouter
  .route("/:id")
  .get(getBootcamp)
  .put(protect, authorize('publisher', 'admin'), updateBootcamp)
  .delete(protect, authorize('publisher', 'admin'), deleteBootcamp);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampByRadius);
bootcampRouter.route("/:id/photo").put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);
export default bootcampRouter;
