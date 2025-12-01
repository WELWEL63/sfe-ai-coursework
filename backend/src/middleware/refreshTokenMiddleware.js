import RefreshToken from "../models/refreshTokenModel.js";
import cfg from "../config/config.js";
import { randomBytes } from "crypto";

export async function makeRefreshToken(userID) {
  const expiresIn = parseInt(cfg.refreshTokenExpiresIn) * 1000; // convert to ms
  const expiresAt = new Date(Date.now() + expiresIn);
  const token = randomBytes(64).toString("hex");

  const refreshToken = new RefreshToken({
    token: token,
    userID: userID,
    expiresAt: expiresAt,
  });

  await refreshToken.save();
  return token;
}

export async function verifyRefreshToken(token) {
  const dbToken = await RefreshToken.findOne({ token: token });
  if (!dbToken) {
    return { valid: false, userID: null };
  }

  if (dbToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ token: token });
    return { valid: false, userID: null };
  }

  return { valid: true, userID: dbToken.userID };
}

// Later add function to revoke tokens

export async function deleteRefreshToken(token) {
  const dbToken = await RefreshToken.deleteOne({ token: token });
  return dbToken;
}

export async function getUserRefreshTokens(userID) {
  const tokens = await RefreshToken.find({ userID: userID });
  return tokens;
}
