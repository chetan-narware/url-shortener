import { AnalyticsRepository } from "./analytics.repository.js";

export class AnalyticsService {
  private analyticsRepository = new AnalyticsRepository();

  async getUrlAnalytics(shortCode: string, userId?: number) {

    const url = await this.analyticsRepository.findUrlByShortCode(shortCode);

    if (!url) {
      throw new Error("URL not found");
    }

    // If URL belongs to a user, enforce ownership
    if (url.userId && userId && url.userId !== userId) {
      throw new Error("Unauthorized access to analytics");
    }

    const totalClicks = await this.analyticsRepository.countClicksByUrlId(url.id);

    const clicksByDateRaw = await this.analyticsRepository.groupClicksByDate(url.id);

    const clicksByDate = clicksByDateRaw.map(entry => ({
      date: entry.date.toISOString().split("T")[0],
      clicks: Number(entry.clicks)
    }));

    return {
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      totalClicks,
      clicksByDate
    };
  }

  async getUserAnalytics(userId: number) {

    const urls = await this.analyticsRepository.getUserUrlsWithClickCounts(userId);

    const formattedUrls = urls.map(url => ({
      shortCode: url.shortCode,
      longUrl: url.longUrl,
      clickCount: url._count.clicks
    }));

    const totalClicks = formattedUrls.reduce(
      (sum, url) => sum + url.clickCount,
      0
    );

    return {
      totalUrls: formattedUrls.length,
      totalClicks,
      urls: formattedUrls
    };
  }
}