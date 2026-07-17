import { Router } from "express";
import { authRouter } from "./auth/entry-points/auth.router.js";
import { organisationsRouter } from "./organisations/entry-points/organisations.router.js";
import { usersRouter } from "./users/entry-points/users.router.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
router.use("/organisations", organisationsRouter);
