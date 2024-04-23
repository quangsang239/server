require("dotenv").config();
const compression = require("compression");
const express = require("express");
const { default: helmet } = require("helmet");
const morgan = require("morgan");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

// init db
require("./dbs/init.mongodb");

// init routes
app.use("", require("./routers"));

// init error handler

app.use((req, res, next) => {
  console.log("error server default");
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  console.log("error server with message");
  console.log(error.status);
  const statusCode = error.status || 500;
  res.status(statusCode);
  res.json({
    error: {
      status: "error",
      message: error.message || "Internal Server Error",
      code: statusCode,
    },
  });
});

module.exports = app;
