import type { z } from "zod";
import type { loginSchema } from "./auth.schema.js";

export type LoginPayload = z.infer<typeof loginSchema>;
