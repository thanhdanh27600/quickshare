-- CreateTable
CREATE TABLE "UrlShortenerRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "ip" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "UrlShortenerHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "urlShortenerRecordId" INTEGER NOT NULL,
    CONSTRAINT "UrlShortenerHistory_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UrlForwardMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userAgent" TEXT,
    "countryCode" TEXT,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    CONSTRAINT "UrlForwardMeta_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerRecord_ip_key" ON "UrlShortenerRecord"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerHistory_hash_key" ON "UrlShortenerHistory"("hash");
