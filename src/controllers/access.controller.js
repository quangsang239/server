"use strict";

class AccessController {
  signUp = async (req, res, next) => {
    try {
      console.log(`signup`, req.body);
      return res.status(201).json({
        code: "201",
        metadata: { userId: 1 },
      });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = new AccessController();
