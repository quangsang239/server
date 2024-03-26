"use strict";

const mongoose = require("mongoose");
const { countConnect, checkOverload } = require("../helpers/check.connect");

const connectString =
  "mongodb+srv://qangsang239:UOsGeIIzJGzMw8XG@ec-project.9l6cp7m.mongodb.net/";

class Database {
  constructor() {
    this._connect();
  }

  _connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", { color: true });
    }
    mongoose
      .connect(connectString)
      .then(() => {
        console.log("MongoDB connected", countConnect());
        checkOverload();
      })
      .catch((err) => {
        console.error(err);
      });
  }
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}

const instance = Database.getInstance();
module.exports = instance;
