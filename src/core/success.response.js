"use strict";

const { ReasonPhrases, StatusCodes } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }) {
    this.metadata = metadata;
    this.message = message || reasonStatusCode;
    this.statusCode = statusCode;
  }

  send(res, headers = {}) {
    return res.status(this.statusCode).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    metadata,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
  }) {
    super({ message, metadata, statusCode, reasonStatusCode });
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
