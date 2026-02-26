import {nanoid} from "nanoid";
import { createUrl,findByShortCode,deleteUrl,incrementClickCount, createClick } from "./url.repository.js";
import { error } from "node:console";

export const generateShortCode = () => {
    return nanoid(7);
}

export const createShortUrl = async (
    longUrl : string,
    userId? : number,
    expiryDate?: Date,
) => {
   let shortCode = generateShortCode();
   let existing = await findByShortCode(shortCode);
   while(existing){
    shortCode = generateShortCode();
    existing = await findByShortCode(shortCode);
   }

   return createUrl(shortCode, longUrl, userId, expiryDate);
};

export const getLongUrl = async (shortCode: string) => {
    const url = await findByShortCode(shortCode);
    if(!url){
        throw new Error("URL not found");
    }

    if(url.expiryDate && new Date() > url.expiryDate){
        throw new Error("URL had expired");
    }

    await incrementClickCount(url.id);
    return url.longUrl;
}

export const removeUrl = async (
  shortCode: string,
  userId?: number
) => {
  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new Error("URL not found");
  }

  // If URL is tied to a user, ensure ownership
  if (url.userId && url.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return deleteUrl(shortCode);
};

export const handleRedirect = async (
  shortCode: string,
  ipAddress?: string,
  userAgent?: string
) => {
  const url = await findByShortCode(shortCode);

  if (!url) {
    throw new Error("URL not found");
  }

  if (url.expiryDate && new Date() > url.expiryDate) {
    throw new Error("URL has expired");
  }

  // Increment counter
  await incrementClickCount(url.id);

  // Store click analytics
  await createClick(url.id, ipAddress, userAgent);

  return url.longUrl;
};