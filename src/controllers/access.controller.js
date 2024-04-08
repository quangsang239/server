"use strict";

const AccessService = require("../services/access.service");
class AccessController {
  signUp = async (req, res, next) => {
    try {
      return res.status(201).json(await AccessService.signup(req.body));
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
