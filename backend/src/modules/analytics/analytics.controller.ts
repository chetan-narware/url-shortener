import { Request, Response, NextFunction } from "express";
import { AnalyticsService } from "./analytics.service.js";
import { AuthenticatedRequest } from "../auth/auth.middleware.js";

export class AnalyticsController {

  private analyticsService = new AnalyticsService();

  async getUrlAnalytics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const shortCode = req.params.shortCode as string;

      const data = await this.analyticsService.getUrlAnalytics(
        shortCode,
        req.user?.id
      );

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async getUserAnalytics(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const userId = req.user!.id;

      const data = await this.analyticsService.getUserAnalytics(userId);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}