import { z } from "zod";
import type { Request, Response } from "express";
import { compareBcrypt } from "../../../../lib/encryption.js";
import { decodeJwt, signJwt } from "../../../../lib/jwt.js";
import { findUserByEmail } from "../data-access/auth.repository.js";
import { loginSchema } from "../data-access/auth.schema.js";
import { env } from "../../../../config/env.js";

export const login = async (req: Request, res: Response) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid request", errors: z.flattenError(parsed.error).fieldErrors });
  }

  const { email, password } = parsed.data;

  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const isPasswordValid = await compareBcrypt(user.password, password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const token = signJwt({
    sub: user.id,
    email: user.email,
    roles: user.roles.map((userRole) => userRole.role.name),
  });

  const { exp } = decodeJwt<{ exp: number }>(token);

  res.cookie("token", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(exp * 1000),
  });

  const { password: _password, ...userWithoutPassword } = user;

  return res.status(200).json({ user: userWithoutPassword });
};
