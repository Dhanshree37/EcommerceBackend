import express from "express";
import { register, login, refresh, logout, checkAuth } from "../controllers/auth.controller.js";
import { validateRequest } from "../middlewares/validate.middleware.js";
import { signupSchema, loginSchema } from "../validations/auth.validation.js";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), register);
router.post("/login", validateRequest(loginSchema), login);
router.post("/refresh-token", refresh);
router.post("/logout", logout);
router.get("/check", checkAuth);


export default router;
