import * as authService from "../services/auth.service.js";
import { AppError } from "../utils/error.util.js";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  maxAge: 7*24*60*60*1000
};  


export const register = async (req,res,next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.registerUser(req.body);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.status(201).json({ success:true, user:{id:user._id,name:user.name,email:user.email}, accessToken });
  } catch(err) { next(err); }
};

export const login = async (req,res,next) => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await authService.loginUser(email,password);
    res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    res.json({ success:true, user:{id:user._id,name:user.name,email:user.email}, accessToken });
  } catch(err){ next(err); }
};

export const refresh = async (req,res,next) => {
  try{
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    const { accessToken, refreshToken:newRefreshToken } = await authService.refreshTokens(refreshToken);
    res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
    res.json({ success:true, accessToken });
  } catch(err){ next(err); }
};

export const logout = async (req,res,next) => {
  try{
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    await authService.logoutUser(refreshToken);
    res.clearCookie("refreshToken", COOKIE_OPTIONS);
    res.json({ success:true, message:"Logged out" });
  } catch(err){ next(err); }
};
