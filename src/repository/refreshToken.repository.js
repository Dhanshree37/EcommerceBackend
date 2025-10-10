import RefreshToken from "../models/refreshToken.model.js";

export const saveRefreshToken = async ({ token, userId, expiresAt }) => 
  RefreshToken.create({ token, user: userId, expiresAt });

export const findRefreshToken = async (token) => 
  RefreshToken.findOne({ token, revoked: false });

export const revokeRefreshToken = async (token) => 
  RefreshToken.findOneAndUpdate({ token }, { revoked: true }, { new: true });
