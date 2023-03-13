/*
  Warnings:

  - A unique constraint covering the columns `[userAgent,ip,urlShortenerHistoryId]` on the table `UrlForwardMeta` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UrlForwardMeta_userAgent_ip_urlShortenerHistoryId_key" ON "UrlForwardMeta"("userAgent", "ip", "urlShortenerHistoryId");
