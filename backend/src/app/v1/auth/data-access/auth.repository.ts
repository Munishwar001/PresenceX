import { prisma } from "../../../../lib/prisma.js";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: { email },
    include: { roles: { include: { role: true } } },
  });
};
