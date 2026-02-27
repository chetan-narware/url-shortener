import { prisma } from "../../config/db.js";

export class AnalyticsRepository {

  async findUrlByShortCode(shortCode: string) {
    return prisma.url.findUnique({
      where: { shortCode }
    });
  }

  async countClicksByUrlId(urlId: number) {
    return prisma.click.count({
      where: { urlId }
    });
  }

  async groupClicksByDate(urlId: number) {
    return prisma.$queryRaw<
      { date: Date; clicks: bigint }[]
    >`
      SELECT DATE("createdAt") as date,
             COUNT(*) as clicks
      FROM "Click"
      WHERE "urlId" = ${urlId}
      GROUP BY DATE("createdAt")
      ORDER BY date ASC;
    `;
  }

  async getUserUrlsWithClickCounts(userId: number) {
    return prisma.url.findMany({
      where: { userId },
      include: {
        _count: {
          select: { clicks: true }
        }
      }
    });
  }
}