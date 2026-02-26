import { prisma } from "../../config/db.js";

export const createUser = async (email: string, passwordHash: string) => {
  return prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });
};

export const findByEmail = async (email: string) => {
  return prisma.user.findUnique({
    where: { email },
  });
};

export const findById = async (id: number) => {
  return prisma.user.findUnique({
    where: { id },
  });
};