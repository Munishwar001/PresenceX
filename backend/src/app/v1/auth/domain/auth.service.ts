import { z } from "zod";
import type { Request, Response } from "express";
import { compareBcrypt, hashToken } from "../../../../lib/encryption.js";
import {
  decodeJwt,
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../../../../lib/jwt.js";
import {
  createRefreshToken,
  findUserByEmail,
  findUserById,
  findValidRefreshToken,
  revokeRefreshToken,
} from "../data-access/auth.repository.js";
import { loginSchema } from "../data-access/auth.schema.js";
import { env } from "../../../../config/env.js";

interface TokenPayload {
  sub: string;
  email: string;
  roles: string[];
}

const setAccessTokenCookie = (res: Response, accessToken: string) => {
  const { exp } = decodeJwt<{ exp: number }>(accessToken);

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(exp * 1000),
  });
};

const setRefreshTokenCookie = (res: Response, refreshToken: string) => {
  const { exp } = decodeJwt<{ exp: number }>(refreshToken);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/v1/auth",
    expires: new Date(exp * 1000),
  });
};

const clearAuthCookies = (res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken", { path: "/api/v1/auth" });
};

const newSessionExpiry = () =>
  new Date(Date.now() + env.SESSION_ABSOLUTE_MAX_DAYS * 24 * 60 * 60 * 1000);

const issueTokens = async (res: Response, tokenPayload: TokenPayload, sessionExpiresAt: Date) => {
  const refreshToken = signRefreshToken(tokenPayload);
  const { exp } = decodeJwt<{ exp: number }>(refreshToken);

  await createRefreshToken(
    tokenPayload.sub,
    hashToken(refreshToken),
    new Date(exp * 1000),
    sessionExpiresAt,
  );

  setAccessTokenCookie(res, signAccessToken(tokenPayload));
  setRefreshTokenCookie(res, refreshToken);
};

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

  await issueTokens(
    res,
    {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((userRole) => userRole.role.name),
    },
    newSessionExpiry(),
  );

  const { password: _password, ...userWithoutPassword } = user;

  return res.status(200).json({ user: userWithoutPassword });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "Missing refresh token" });
  }

  let payload: TokenPayload;
  try {
    payload = verifyRefreshToken<TokenPayload>(refreshToken);
  } catch {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  const tokenHash = hashToken(refreshToken);
  const storedToken = await findValidRefreshToken(tokenHash);
  if (!storedToken) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
  
  const user = await findUserById(payload.sub);
  if (!user) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }

  await revokeRefreshToken(tokenHash);

  await issueTokens(
    res,
    {
      sub: user.id,
      email: user.email,
      roles: user.roles.map((userRole) => userRole.role.name),
    },
    storedToken.sessionExpiresAt,
  );

  const { password: _password, ...userWithoutPassword } = user;

  return res.status(200).json({ user: userWithoutPassword });
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await revokeRefreshToken(hashToken(refreshToken));
  }

  clearAuthCookies(res);

  return res.status(200).json({ message: "Logged out" });
};
