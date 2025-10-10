import jwt from "jsonwebtoken";
import { AppError } from "./error.util.js";
import { ACCESS_SECRET, REFRESH_SECRET, ACCESS_EXPIRES_IN, REFRESH_EXPIRES_IN, ISSUER } from "../config/config.js";


// Generate access token
export const generateAccessToken = (payload) => 
  jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_EXPIRES_IN, issuer: ISSUER });

// Generate refresh token
export const generateRefreshToken = (payload) => 
  jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_EXPIRES_IN, issuer: ISSUER });

// Verify access token
export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, ACCESS_SECRET);
  } catch (err) {
    throw new AppError(err.name === "TokenExpiredError" ? "Access token expired" : "Invalid access token", 401);
  }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, REFRESH_SECRET);
  } catch (err) {
    throw new AppError(err.name === "TokenExpiredError" ? "Refresh token expired" : "Invalid refresh token", 401);
  }
};
