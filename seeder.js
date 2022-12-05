import fs from "fs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bootcamp from "./models/Bootcamps.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// load our env vars
dotenv.config({ path: "./config/config.env" });

// connect to database
mongoose.connect(process.env.MONGO_URI);

// read json files
const bootcamps = JSON.parse(
  fs.readFileSync(`${__dirname}/_data/bootcamps.json`, "utf-8")
);

// import data into db
const importData = async () => {
  try {
    await bootcamp.create(bootcamps);
    console.log("data imported... ");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

// delete data
const deleteData = async () => {
  try {
    await bootcamp.deleteMany();
    console.log("data deleted... ");
    process.exit();
  } catch (error) {
    console.error(error);
  }
};

if(process.argv[2] === '-i') {
    importData();
} else if(process.argv[2] === '-d') {
    deleteData();
}