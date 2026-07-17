import type { z } from "zod";
import type { createMemberSchema } from "./users.schema.js";

export type CreateMemberPayload = z.infer<typeof createMemberSchema>;
