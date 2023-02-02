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
    "urlShortenerRecordId" INTEGER,
    CONSTRAINT "UrlShortenerHistory_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UrlShortenerRecord_ip_key" ON "UrlShortenerRecord"("ip");
