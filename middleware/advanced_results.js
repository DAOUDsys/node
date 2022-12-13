import bootcamp from "../models/Bootcamps.js";
import path from "path";
const advancedResults = (model, populate) => async (req, res, next) => {
  let query;
  // copy query
  const reqQuery = { ...req.query };

  //fields to exclude
  const removeFields = ["select", "sort", "limit", "page"];

  // loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  // create query string
  let queryStr = JSON.stringify(req.query);
  // create operators ($gte, $lt , ...)
  queryStr = queryStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );
  // find resource
  query = model.find(JSON.parse(queryStr))
  // select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  // sort
  if (req.query.sort) {
    const sortBy = req.query.sort.replace(",", " ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createdAt");
  }
  // pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 25;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await model.countDocuments();
  query = query.skip(startIndex).limit(limit);

  if(populate) {
    query = query.populate(populate)
  }

  // execute query
  const data = await query;

  // pagination result
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }

  res.advancedResults = {
    success: true,
    count: data.length,
    pagination,
    data: data,
  };
  next();
};

export default advancedResults;
