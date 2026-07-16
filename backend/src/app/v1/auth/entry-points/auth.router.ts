import { Router } from "express";
import { login, logout, refresh } from "../domain/auth.service.js";

export const authRouter = Router();

authRouter.post("/login", login);
authRouter.post("/refresh", refresh);
authRouter.post("/logout", logout);
