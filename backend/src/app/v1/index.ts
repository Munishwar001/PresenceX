import { Router } from "express";
import { authRouter } from "./auth/entry-points/auth.router.js";
import { usersRouter } from "./users/entry-points/users.router.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
