import express from "express";
import {
  getBootcamps,
  getBootcamp,
  deleteBootcamp,
  updateBootcamp,
  createBootcamp,
  getBootcampByRadius,
} from "../controllers/bootcamps.js";
const bootcampRouter = express.Router();

bootcampRouter.route("/").get(getBootcamps).post(createBootcamp);
bootcampRouter
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
bootcampRouter.route("/radius/:zipcode/:distance").get(getBootcampByRadius);
export default bootcampRouter;
