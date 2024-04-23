"use strict";

const ShopModel = require("../models/shop.model");
const findByEmail = async ({
  email,
  select = { email: 1, password: 2, name: 1, status: 1, roles: 1 },
}) => {
  const shop = await ShopModel.findOne({ email }).select(select).lean();
  return shop;
};

module.exports = { findByEmail };
