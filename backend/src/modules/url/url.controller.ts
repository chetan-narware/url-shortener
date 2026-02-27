import { Request, Response, NextFunction } from "express";
import { createShortUrl, removeUrl, handleRedirect } from "./url.service.js";
import { AuthenticatedRequest } from "../auth/auth.middleware.js";

export const createUrlHandler = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { longUrl, expiryDate } = req.body;

    const url = await createShortUrl(
      longUrl,
      req.user?.id,
      expiryDate ? new Date(expiryDate) : undefined
    );

    const baseUrl = process.env.BASE_URL || "http://localhost:3000";

    res.status(201).json({
      success: true,
      data: {
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/api/urls/${url.shortCode}`,
        longUrl: url.longUrl,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const redirectHandler = async (
  req: Request<{ shortCode: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;

    const ipAddress = req.ip;
    const userAgent = req.headers["user-agent"];

    const longUrl = await handleRedirect(
      shortCode,
      ipAddress,
      typeof userAgent === "string" ? userAgent : undefined
    );

    return res.redirect(longUrl);
  } catch (error) {
    next(error);
  }
};

export const deleteUrlHandler = async (
  req: AuthenticatedRequest & Request<{ shortCode: string }>,
  res: Response,
  next: NextFunction
) => {
  try {
    const { shortCode } = req.params;

    await removeUrl(shortCode, req.user?.id);

    res.status(200).json({
      success: true,
      message: "URL deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};