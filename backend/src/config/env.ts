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
  JWT_SECRET: required("JWT_SECRET", process.env.JWT_SECRET),
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "1d",
  SUPERADMIN_NAME: process.env.SUPERADMIN_NAME ?? "Super Admin",
  SUPERADMIN_EMAIL: process.env.SUPERADMIN_EMAIL ?? "superadmin@presencex.dev",
  SUPERADMIN_PASSWORD: process.env.SUPERADMIN_PASSWORD ?? "ChangeMe123!",
};
