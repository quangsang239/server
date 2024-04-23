"use strict";

const JWT = require("jsonwebtoken");

const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");
const { HEADER } = require("../constants");

const createTokenPair = async (payload, publicKey, privateKey) => {
  const accessToken = await JWT.sign(payload, publicKey, {
    expiresIn: "2 days",
  });

  const refreshToken = await JWT.sign(payload, privateKey, {
    expiresIn: "7 days",
  });
  return { accessToken, refreshToken };
};

const authentication = asyncHandler(async (req, res, next) => {
  /*
  1. check userId missing
  2. get token
  3. verify token
  4. check user in database
  5. check key store with this userId
  6. OK all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid value");
  // 2. get token
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found value");

  // 3. verify token
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid value");

  // 4. check user in database
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid value");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});
const authenticationV2 = asyncHandler(async (req, res, next) => {
  /*
  1. check userId missing
  2. get token
  3. verify token
  4. check user in database
  5. check key store with this userId
  6. OK all => return next()
  */

  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid value");
  // 2. get token
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not found value");

  // 3. verify token
  if (req.headers[HEADER.REFRESH_TOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new AuthFailureError("Invalid value");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new AuthFailureError("Invalid value");

  // 4. check user in database
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new AuthFailureError("Invalid value");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJWT = async (token, keySecret) => {
  return await JWT.verify(token, keySecret);
};
module.exports = {
  authenticationV2,
  createTokenPair,
  authentication,
  verifyJWT,
};
