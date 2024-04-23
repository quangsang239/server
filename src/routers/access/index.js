"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const router = express.Router();
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");

// signup
router.post("/shop/signup", asyncHandler(accessController.signUp));

// login
router.post("/shop/login", asyncHandler(accessController.login));

// authentication
router.use(authenticationV2);

//logout
router.post("/shop/logout", asyncHandler(accessController.logout));

// refresh token
router.post(
  "/shop/refresh-token",
  asyncHandler(accessController.handleRefreshToken)
);

module.exports = router;
