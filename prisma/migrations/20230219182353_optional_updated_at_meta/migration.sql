-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UrlForwardMeta" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userAgent" TEXT,
    "countryCode" TEXT,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    CONSTRAINT "UrlForwardMeta_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UrlForwardMeta" ("countryCode", "createdAt", "id", "updatedAt", "urlShortenerHistoryId", "userAgent") SELECT "countryCode", "createdAt", "id", "updatedAt", "urlShortenerHistoryId", "userAgent" FROM "UrlForwardMeta";
DROP TABLE "UrlForwardMeta";
ALTER TABLE "new_UrlForwardMeta" RENAME TO "UrlForwardMeta";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
