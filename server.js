import express from "express";
import dotenv from "dotenv";
import bootcampRouter from "./routes/bootcamps.route.js";
import coursesRouter from "./routes/courses.route.js";
import logger from "./middleware/logger.js";
import morgan from "morgan";
import fileupload from "express-fileupload";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import reviewRouter from "./routes/review.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// load env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
connectDB();

const app = express();

// body parser
app.use(express.json());

// dev logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// file uploading
app.use(fileupload());

// set static folder
app.use(express.static(path.join(__dirname, "public")));

app.use(logger);

app.use(cookieParser());

// mount routers
app.use("/api/v1/bootcamps", bootcampRouter);
app.use("/api/v1/courses", coursesRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/reviews", reviewRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error ${err.message}`);
  // close server & exit process
  server.close(() => process.exit(1));
});
