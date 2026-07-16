import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

export const signJwt = (payload: object) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);
};

export const verifyJwt = <T>(token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as T;
};

export const decodeJwt = <T>(token: string) => {
  return jwt.decode(token) as T;
};
