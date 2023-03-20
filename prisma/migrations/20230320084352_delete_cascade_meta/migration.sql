-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UrlForwardMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userAgent" TEXT,
    "countryCode" TEXT,
    "ip" TEXT,
    "fromClientSide" BOOLEAN DEFAULT false,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    CONSTRAINT "UrlForwardMeta_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_UrlForwardMeta" ("countryCode", "createdAt", "fromClientSide", "id", "ip", "updatedAt", "urlShortenerHistoryId", "userAgent") SELECT "countryCode", "createdAt", "fromClientSide", "id", "ip", "updatedAt", "urlShortenerHistoryId", "userAgent" FROM "UrlForwardMeta";
DROP TABLE "UrlForwardMeta";
ALTER TABLE "new_UrlForwardMeta" RENAME TO "UrlForwardMeta";
CREATE UNIQUE INDEX "UrlForwardMeta_userAgent_ip_urlShortenerHistoryId_key" ON "UrlForwardMeta"("userAgent", "ip", "urlShortenerHistoryId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
