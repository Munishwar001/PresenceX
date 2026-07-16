import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { router } from "./v1/auth/index.js";
import { env } from "../config/env.js";

export const app = express();

app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1", router);

export default app;
