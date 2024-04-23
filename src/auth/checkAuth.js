"use strict";

const { HEADER } = require("../constants");
const { findById } = require("../services/apiKey.service");

const apiKey = async (req, res, next) => {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key) {
    return res.status(403).json({
      code: "403",
      message: "Forbidden",
    });
  }

  // check object key
  const objKey = await findById(key);

  if (!objKey) {
    return res.status(403).json({
      code: "403",
      message: "Forbidden",
    });
  }

  req.objKey = objKey;
  return next();
};

const permission = (permission) => {
  return (req, res, next) => {
    if (!req.objKey.permissions) {
      return res.status(403).json({
        code: "403",
        message: "permission denied",
      });
    }
    const validPermission = req.objKey.permissions.includes(permission);
    if (!validPermission) {
      return res
        .status(403)
        .json({ code: "403", message: "permission denied" });
    }
    return next();
  };
};

module.exports = {
  apiKey,
  permission,
};
