import { nanoid } from "nanoid";
import { redis } from "../../config/redis.js";
import {
  createUrl,
  findByShortCode,
  deleteUrl,
  incrementClickCount,
  createClick,
} from "./url.repository.js";

export const generateShortCode = () => {
  return nanoid(7);
};

export const createShortUrl = async (
  longUrl: string,
  userId?: number,
  expiryDate?: Date
) => {
  let shortCode = generateShortCode();

  let existing = await findByShortCode(shortCode);
  while (existing) {
    shortCode = generateShortCode();
    existing = await findByShortCode(shortCode);
  }

  return createUrl(shortCode, longUrl, userId, expiryDate);
};

export const removeUrl = async (
  shortCode: string,
  userId?: number
) => {
  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new Error("URL not found");
  }

  if (url.userId && url.userId !== userId) {
    throw new Error("Unauthorized");
  }

  await deleteUrl(shortCode);
  await redis.del(shortCode);
};

export const handleRedirect = async (
  shortCode: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const cachedUrl = await redis.get(shortCode);

  let longUrl: string;
  let urlRecord;

  if (cachedUrl) {
    longUrl = cachedUrl;
    urlRecord = await findByShortCode(shortCode);
  } else {
    urlRecord = await findByShortCode(shortCode);

    if (!urlRecord) {
      throw new Error("URL not found");
    }

    if (urlRecord.expiryDate && new Date() > urlRecord.expiryDate) {
      throw new Error("URL has expired");
    }

    longUrl = urlRecord.longUrl;

    await redis.set(shortCode, longUrl, {
      EX: 60 * 60,
    });
  }

  if (!urlRecord) {
    throw new Error("URL not found");
  }

  await incrementClickCount(urlRecord.id);
  await createClick(urlRecord.id, ipAddress, userAgent);

  return longUrl;
};