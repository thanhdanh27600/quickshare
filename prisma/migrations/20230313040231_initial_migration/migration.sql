-- CreateTable
CREATE TABLE "UrlShortenerRecord" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ip" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "UrlShortenerHistory" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "urlShortenerRecordId" INTEGER NOT NULL,
    CONSTRAINT "UrlShortenerHistory_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "UrlForwardMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userAgent" TEXT,
    "countryCode" TEXT,
    "ip" TEXT,
    "fromClientSide" BOOLEAN DEFAULT false,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    CONSTRAINT "UrlForwardMeta_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerRecord_ip_key" ON "UrlShortenerRecord"("ip");

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerHistory_hash_key" ON "UrlShortenerHistory"("hash");
