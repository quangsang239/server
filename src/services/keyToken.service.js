"use strict";

const keyTokenModel = require("../models/keyToken.model");
const KeyTokenModel = require("../models/keyToken.model");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    const filter = { user: userId },
      update = { publicKey, privateKey, refreshTokensUsed: [], refreshToken },
      options = { upsert: true, new: true };
    const tokens = await KeyTokenModel.findOneAndUpdate(
      filter,
      update,
      options
    );
    return tokens ? tokens.publicKey : null;
  };

  static findByUserId = async (userId) => {
    return await KeyTokenModel.findOne({
      user: new Types.ObjectId(userId),
    });
  };

  static removeKeyById = async (id) => {
    return await KeyTokenModel.findByIdAndDelete(id).lean();
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return await KeyTokenModel.findOne({
      refreshTokensUsed: refreshToken,
    }).lean();
  };
  static findByRefreshToken = async (refreshToken) => {
    return await KeyTokenModel.findOne({
      refreshToken,
    });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({ user: userId }).lean();
  };
}

module.exports = KeyTokenService;
