import { HTTPCodes, respondWithErrorJson } from "../utils/json.js";
import { verifyJWT, makeJWT } from "./jwtMiddleware.js";
import { verifyRefreshToken } from "./refreshTokenMiddleware.js";
import Users from "../models/usersModel.js";
import cfg from "../config/config.js";
import { ForbiddenError, UnauthorizedError } from "./errorMiddleware.js";

export async function authRoute(req, res, next) {
  const accessToken = req?.cookies?.accessToken || "";
  const refreshToken = req?.cookies?.refreshToken || "";
  if (!accessToken && !refreshToken) {
    throw new UnauthorizedError("Access and/or Refresh token is missing.");
  }

  const { success, data } = await verifyJWT(accessToken);
  if (!success) {
    if (refreshToken) {
      const { valid, userID } = await verifyRefreshToken(refreshToken);
      if (valid) {
        req.body.userID = userID;
        const newAccessToken = await makeJWT(userID);
        res.cookie("accessToken", newAccessToken, {
          httpOnly: true,
          secure: cfg.nodeEnv === "production",
          sameSite: "strict",
          maxAge: cfg.jwtExpiresIn * 1000,
        });
        return next();
      }
      throw new UnauthorizedError("Refresh token is invalid or expired.");
    }
    throw new UnauthorizedError("Access token has expired.");
  }
  req.body.userID = data.userID;
  next();
}

export async function adminRoute(req, res, next) {
  const dbUser = await Users.findById(req.body.userID);
  if (!dbUser || dbUser.role !== "admin") {
    throw new ForbiddenError("Admin privileges are required.");
  }
  next();
}
