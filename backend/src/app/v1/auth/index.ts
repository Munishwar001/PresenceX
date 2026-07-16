import { Router } from "express";
const router = Router();
import { authRouter } from "./entry-points/auth.router.js";

router.use("/auth", authRouter);

export { router };