import { prisma } from "../../config/db.js";

export const createUrl = async (
    shortCode: string,
    longUrl: string,
    userId?: number,
    expiryDate?: Date
) => {
    return prisma.url.create({
        data: {
            shortCode,
            longUrl,
            userId: userId ?? null,
            expiryDate: expiryDate ?? null,
        },
    });
};

export const findByShortCode = async (shortCode: string) => {
    return prisma.url.findUnique({
        where : {shortCode},
    });
};

export const deleteUrl = async (shortCode: string) => {
    return prisma.url.delete({
        where: {shortCode}
    })
}

export const incrementClickCount = async (id: number) => {
  return prisma.url.update({
    where: { id },
    data: {
      clickCount: {
        increment: 1,
      },
    },
  });
};

export const createClick = async (
  urlId: number,
  ipAddress?: string,
  userAgent?: string
) => {
  return prisma.click.create({
    data: {
      urlId,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    },
  });
};