import { prisma } from "../src/lib/prisma.js";
import { bcryptPass } from "../src/lib/encryption.js";
import { env } from "../src/config/env.js";

const ROLES = [
  { name: "superadmin", description: "Full access to manage users, roles, and settings across the platform" },
  { name: "admin", description: "Manages users and settings within their scope" },
  { name: "teacher", description: "Manages classes and tracks attendance for their students" },
  { name: "student", description: "Standard access for students to view their own attendance" },
];

const SUPERADMIN = {
  name: env.SUPERADMIN_NAME,
  email: env.SUPERADMIN_EMAIL,
  password: env.SUPERADMIN_PASSWORD,
};

async function main() {
  for (const role of ROLES) {
    await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
  }

  const superadminRole = await prisma.role.findUniqueOrThrow({
    where: { name: "superadmin" },
  });

  const passwordHash = await bcryptPass(SUPERADMIN.password);

  const superadmin = await prisma.user.upsert({
    where: { email: SUPERADMIN.email },
    update: {},
    create: {
      name: SUPERADMIN.name,
      email: SUPERADMIN.email,
      password: passwordHash,
    },
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: superadmin.id, roleId: superadminRole.id } },
    update: {},
    create: { userId: superadmin.id, roleId: superadminRole.id },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
