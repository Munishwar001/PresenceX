import { z } from "zod";

export const createOrganisationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  address: z.string().min(1, "Address is required").optional(),
  contactEmail: z.email("Invalid email format").optional(),
  contactPhone: z.string().min(1, "Contact phone is required").optional(),
});
