import { prisma } from "../../../../lib/prisma.js";

const createdByFields = { select: { id: true, name: true, email: true } };

export const createOrganisation = (data: {
  name: string;
  type: string;
  address?: string;
  contactEmail?: string;
  contactPhone?: string;
  createdById: string;
}) => {
  return prisma.organisation.create({
    data,
    include: { createdBy: createdByFields },
  });
};

export const listOrganisations = () => {
  return prisma.organisation.findMany({
    orderBy: { createdAt: "desc" },
    include: { createdBy: createdByFields },
  });
};
