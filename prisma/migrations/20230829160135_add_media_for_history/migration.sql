-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "urlShortenerHistoryId" INTEGER,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Media_url_key" ON "Media"("url");

-- CreateIndex
CREATE UNIQUE INDEX "Media_urlShortenerHistoryId_key" ON "Media"("urlShortenerHistoryId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
