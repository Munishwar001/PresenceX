import type { z } from "zod";
import type { createOrganisationSchema } from "./organisations.schema.js";

export type CreateOrganisationPayload = z.infer<typeof createOrganisationSchema>;
