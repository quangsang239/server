"use strict";

const mongoose = require("mongoose");
const _SECONDS = 5000;
const os = require("os");
const process = require("process");

// count number of connections
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connections: ${numConnect}`);
};

// check overload connections
const checkOverload = () => {
  // setInterval(() => {
  //   const numConnect = mongoose.connections.length;
  //   const numCore = os.cpus().length;
  //   const memoryUsage = process.memoryUsage().rss;
  //   console.log(`Memory usage: ${memoryUsage / 1024 / 1024} MB`);
  //   console.log(`Active connections: ${numConnect}`);
  //   const maxConnect = numCore * 5;
  //   if (numConnect > maxConnect) {
  //     console.log("Overload connections");
  //   }
  // }, _SECONDS);
};

module.exports = {
  countConnect,
  checkOverload,
};
