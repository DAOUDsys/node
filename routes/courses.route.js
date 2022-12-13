import express from "express";
import Course from "../models/course.js";
import advancedResults from "../middleware/advanced_results.js";
import {
  getCourses,
  getCourse,
  addCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courses.js";
import {protect, authorize} from '../middleware/auth.js';

const coursesRouter = express.Router({ mergeParams: true });

coursesRouter
  .route("/")
  .get(
    advancedResults(Course, {
      path: "bootcamp",
      select: "name description",
    }),
    getCourses
  )
  .post(protect, authorize('publisher', 'admin'), addCourse);
coursesRouter
  .route("/:id")
  .get(getCourse)
  .put(protect, authorize('publisher', 'admin'), updateCourse)
  .delete(protect, authorize('publisher', 'admin'), deleteCourse);

export default coursesRouter;
