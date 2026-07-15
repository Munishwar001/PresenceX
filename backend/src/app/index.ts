import express from "express";
import { authRouter } from "./v1/auth/index.js";

export const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/v1/auth", authRouter);

export default app;
