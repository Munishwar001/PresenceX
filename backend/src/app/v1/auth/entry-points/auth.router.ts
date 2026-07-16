import { Router } from "express";
import { login } from "../domain/auth.service.js";

export const authRouter = Router();

authRouter.post("/login", login);
