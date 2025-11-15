import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";


const app = express();

app.use(cors({ origin: "http://localhost:3000", credentials: true })); // frontend URL
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/auth", authRoutes);

// Global error handler
app.use(globalErrorHandler);


export default app;
