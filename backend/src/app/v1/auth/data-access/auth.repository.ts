import { prisma } from "../../../../lib/prisma.js";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });
};

export const findUserById = (id: string) => {
  return prisma.user.findUnique({
    where: { id },
    include: { roles: { include: { role: true } } },
  });
};

export const createRefreshToken = (
  userId: string,
  tokenHash: string,
  expiresAt: Date,
  sessionExpiresAt: Date,
) => {
  return prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt, sessionExpiresAt },
  });
};

export const findValidRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      revokedAt: null,
      expiresAt: { gt: new Date() },
      sessionExpiresAt: { gt: new Date() },
    },
  });
};

export const revokeRefreshToken = (tokenHash: string) => {
  return prisma.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
};
