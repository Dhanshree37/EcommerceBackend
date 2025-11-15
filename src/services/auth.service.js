import * as userRepo from "../repository/user.repository.js";
import * as rtRepo from "../repository/refreshToken.repository.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { AppError } from "../utils/error.util.js";

// Register
export const registerUser = async (userData) => {
  const existing = await userRepo.findByEmail(userData.email);
  if (existing) throw new AppError("Email already registered", 400);

  const user = await userRepo.createUser(userData);

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  const decoded = verifyRefreshToken(refreshToken);
  await rtRepo.saveRefreshToken({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { user, accessToken, refreshToken };
};

// Login
export const loginUser = async (email, password) => {
  const user = await userRepo.findByEmail(email);
  if (!user || !(await user.comparePassword(password)))
    throw new AppError("Invalid email or password", 401);

  await userRepo.updateLastLogin(user._id);

  const accessToken = generateAccessToken({ id: user._id });
  const refreshToken = generateRefreshToken({ id: user._id });

  const decoded = verifyRefreshToken(refreshToken);
  await rtRepo.saveRefreshToken({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { user, accessToken, refreshToken };
};

// Refresh tokens
export const refreshTokens = async (refreshToken) => {
  if (!refreshToken) throw new AppError("Refresh token required", 401);

  const stored = await rtRepo.findRefreshToken(refreshToken);
  if (!stored) throw new AppError("Refresh token not found or revoked", 401);

  const payload = verifyRefreshToken(refreshToken);

  const user = await userRepo.findById(payload.id);
  if (!user) throw new AppError("User not found", 401);

  const newAccessToken = generateAccessToken({ id: user._id });
  const newRefreshToken = generateRefreshToken({ id: user._id });

  await rtRepo.revokeRefreshToken(refreshToken);
  const decoded = verifyRefreshToken(newRefreshToken);
  await rtRepo.saveRefreshToken({
    token: newRefreshToken,
    userId: user._id,
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Logout
export const logoutUser = async (refreshToken) => {
  if (!refreshToken) throw new AppError("Refresh token required", 400);
  await rtRepo.revokeRefreshToken(refreshToken);
};

// Verify user
export const checkAuth = async (refreshToken) => {
  if (!refreshToken) return { loggedIn: false };

  // Check if token exists in DB
  const stored = await rtRepo.findRefreshToken(refreshToken);
  if (!stored) return { loggedIn: false };

  // Verify token
  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch (err) {
    return { loggedIn: false };
  }

  // Get user
  const user = await userRepo.findById(payload.id);
  if (!user) return { loggedIn: false };

  // Issue new access token
  const accessToken = generateAccessToken({ id: user._id });

  return { loggedIn: true, accessToken };
};
