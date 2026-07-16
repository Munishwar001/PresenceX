import dotenv from "dotenv";

dotenv.config();

function required(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DATABASE_URL: required("DATABASE_URL", process.env.DATABASE_URL),
  CORS_ORIGIN: process.env.CORS_ORIGIN ?? "http://localhost:5173",
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET", process.env.JWT_ACCESS_SECRET),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET", process.env.JWT_REFRESH_SECRET),
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "30d",
  SESSION_ABSOLUTE_MAX_DAYS: process.env.SESSION_ABSOLUTE_MAX_DAYS
    ? Number(process.env.SESSION_ABSOLUTE_MAX_DAYS)
    : 30,
  SUPERADMIN_NAME: process.env.SUPERADMIN_NAME ?? "Super Admin",
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL ?? "superadmin@presencex.dev",
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD ?? "ChangeMe123!",
};
