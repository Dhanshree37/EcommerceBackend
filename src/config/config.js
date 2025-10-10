import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });

export const PORT = process.env.PORT || 5000;
export const MONGO_URI = process.env.MONGO_URI;
export const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
export const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
export const ACCESS_EXPIRES_IN = process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";
export const REFRESH_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";
export const ISSUER = process.env.JWT_ISSUER || "ecommerce-backend";
