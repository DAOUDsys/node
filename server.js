import express from "express";
import dotenv from "dotenv";
import bootcampRouter from "./routes/bootcamps.js";
import logger from "./middleware/logger.js";
import morgan from "morgan";
import { connectDB } from "./config/db.js";
import { errorHandler } from "./middleware/error.js";

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

app.use(logger);

// mount routers
app.use("/api/v1/bootcamps", bootcampRouter);

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
