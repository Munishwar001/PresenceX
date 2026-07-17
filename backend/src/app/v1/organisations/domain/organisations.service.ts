import { z } from "zod";
import type { Request, Response } from "express";
import { createOrganisation as createOrganisationRecord, listOrganisations as listOrganisationRecords } from "../data-access/organisations.repository.js";
import { createOrganisationSchema } from "../data-access/organisations.schema.js";

export const createOrganisation = async (req: Request, res: Response) => {
  const parsed = createOrganisationSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: z.flattenError(parsed.error).fieldErrors });
  }

  const organisation = await createOrganisationRecord({
    ...parsed.data,
    createdById: req.user!.sub,
  });

  return res.status(201).json({ organisation });
};

export const listOrganisations = async (_req: Request, res: Response) => {
  const organisations = await listOrganisationRecords();
  return res.status(200).json({ organisations });
};
