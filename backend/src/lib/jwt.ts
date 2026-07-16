import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signAccessToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES_IN } as jwt.SignOptions);
};

export const signRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyAccessToken = <T>(token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as T;
};

export const verifyRefreshToken = <T>(token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as T;
};

export const decodeJwt = <T>(token: string) => {
  return jwt.decode(token) as T;
};
