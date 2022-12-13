import express from "express";
import advancedResults from "../middleware/advanced_results.js";
import { addReview, getReview, getReviews } from "../controllers/review.js";
import bootcampRouter from "./bootcamps.route.js";
import Review from "../models/review.js";
import { protect, authorize } from "../middleware/auth.js";

const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), addReview);
reviewRouter.route("/:id").get(getReview);

export default reviewRouter;
