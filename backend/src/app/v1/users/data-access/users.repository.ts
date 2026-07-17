import { prisma } from "../../../../lib/prisma.js";

export const findUserByEmail = (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findRoleByName = (name: string) => {
  return prisma.role.findUnique({ where: { name } });
};

export const createUserWithRole = (data: {
  name: string;
  email: string;
  password: string;
  roleId: string;
}) => {
  return prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password,
      roles: { create: { roleId: data.roleId } },
    },
    include: { roles: { include: { role: true } } },
  });
};
