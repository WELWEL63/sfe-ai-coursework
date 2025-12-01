import pkg from "jsonwebtoken";
import cfg from "../config/config.js";

const { sign, verify } = pkg;

export async function makeJWT(userID) {
  const token = sign(
    {
      iss: cfg.jwtIss,
      sub: userID,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + parseInt(cfg.jwtExpiresIn),
    },
    cfg.jwtSecret,
    { algorithm: "HS256" }
  );
  return token;
}

export async function verifyJWT(token) {
  let decoded;
  try {
    decoded = verify(token, cfg.jwtSecret, { algorithms: ["HS256"] });
  } catch (err) {
    return {
      success: false,
      data: { type: "invalid_token", message: "Invalid token" },
    };
  }
  if (decoded.iss !== cfg.jwtIss) {
    return {
      success: false,
      data: { type: "invalid_issuer", message: "Invalid issuer" },
    };
  }
  if (decoded.expresIn < Math.floor(Date.now() / 1000)) {
    return {
      success: false,
      data: { type: "expired", message: "Token has expired" },
    };
  }
  if (!decoded.sub) {
    return {
      success: false,
      data: { type: "invalid_subject", message: "Invalid subject" },
    };
  }
  return {
    success: true,
    data: { type: "valid", message: "Token is valid", userID: decoded.sub },
  };
}
