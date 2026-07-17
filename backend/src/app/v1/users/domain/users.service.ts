import { z } from "zod";
import type { Request, Response } from "express";
import { bcryptPass, generatePassword } from "../../../../lib/encryption.js";
import { createUserWithRole, findRoleByName, findUserByEmail } from "../data-access/users.repository.js";
import { createMemberSchema } from "../data-access/users.schema.js";

export const createMember = async (req: Request, res: Response) => {
  const parsed = createMemberSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: z.flattenError(parsed.error).fieldErrors });
  }

  const { name, email, role, password } = parsed.data;

  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ message: "A user with this email already exists" });
  }

  const roleRecord = await findRoleByName(role);
  if (!roleRecord) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const generatedPassword = password ?? generatePassword(12);
  const passwordHash = await bcryptPass(generatedPassword);

  const user = await createUserWithRole({
    name,
    email,
    password: passwordHash,
    roleId: roleRecord.id,
  });

  const { password: _password, ...userWithoutPassword } = user;

  return res.status(201).json({
    user: userWithoutPassword,
    ...(password ? {} : { temporaryPassword: generatedPassword }),
  });
};
