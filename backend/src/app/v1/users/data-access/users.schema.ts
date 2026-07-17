import { z } from "zod";

export const MEMBER_ROLES = ["admin", "teacher", "student"] as const;

export const createMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.email("Invalid email format"),
  role: z.enum(MEMBER_ROLES, { message: "Invalid role" }),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
});
