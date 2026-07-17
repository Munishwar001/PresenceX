import { Router } from "express";
import { requireAuth, requireRole } from "../../../../middleware/auth.middleware.js";
import { createMember } from "../domain/users.service.js";

export const usersRouter = Router();

usersRouter.post("/", requireAuth, requireRole("superadmin"), createMember);
