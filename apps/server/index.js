import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";

import pool from "./src/config/db.js";
import userRoutes from "./src/routes/userRoutes.js";
import profileRoutes from "./src/routes/profileRoutes.js";
import errorHandler from "./src/middleware/errorMiddleware.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === "production";



app.set("trust proxy", 1);


app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(compression());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

if (!isProduction) {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}


app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      database: "disconnected",
    });
  }
});

app.use("/api/users", userRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});