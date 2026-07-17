import { Router } from "express";
import { requireAuth, requireRole } from "../../../../middleware/auth.middleware.js";
import { createOrganisation, listOrganisations } from "../domain/organisations.service.js";

export const organisationsRouter = Router();

organisationsRouter.use(requireAuth, requireRole("admin", "superadmin"));
organisationsRouter.post("/", createOrganisation);
organisationsRouter.get("/", listOrganisations);
