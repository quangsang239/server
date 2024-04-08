"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { RoleShop } = require("../constants/access");
const { getIntoData } = require("../utils/index");
const crypto = require("crypto");

class AccessService {
  static signup = async ({ name, email, password }) => {
    try {
      // step1: check email exits
      const holderShop = await shopModel.findOne({ email }).lean();
      if (holderShop) {
        return {
          code: "xxxx",
          message: "shop already register",
        };
      }
      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // create private key, public key
        const privateKey = crypto.randomBytes(64).toString("hex");
        const publicKey = crypto.randomBytes(64).toString("hex");

        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey,
        });

        if (!keyStore) {
          return {
            code: "xxxx",
            message: "publicKeyString error",
          };
        }
        // create token pair
        const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

        console.log({ tokens });

        return {
          code: 201,
          metadata: {
            shop: getIntoData({ fields: ["_id", "name", "email"], object: newShop }),
            tokens,
          },
        };
      }
      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
