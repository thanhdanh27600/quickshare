-- CreateTable
CREATE TABLE "UrlShortenerRecord" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ip" TEXT NOT NULL,
    CONSTRAINT "UrlShortenerRecord_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "UrlShortenerHistory" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "urlShortenerRecordId" INTEGER NOT NULL,
    CONSTRAINT "UrlShortenerHistory_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "UrlForwardMeta" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userAgent" TEXT,
    "countryCode" TEXT,
    "ip" TEXT,
    "fromClientSide" BOOLEAN DEFAULT false,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    CONSTRAINT "UrlForwardMeta_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerRecord_ip_key" ON "UrlShortenerRecord"("ip");
-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerHistory_hash_key" ON "UrlShortenerHistory"("hash");
-- CreateIndex
CREATE UNIQUE INDEX "UrlForwardMeta_userAgent_ip_urlShortenerHistoryId_key" ON "UrlForwardMeta"("userAgent", "ip", "urlShortenerHistoryId");
-- AddForeignKey
ALTER TABLE "UrlShortenerHistory"
ADD CONSTRAINT "UrlShortenerHistory_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "UrlForwardMeta"
ADD CONSTRAINT "UrlForwardMeta_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
