-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_noteId_fkey";

-- DropForeignKey
ALTER TABLE "Media" DROP CONSTRAINT "Media_urlShortenerHistoryId_fkey";

-- DropIndex
DROP INDEX "Media_urlShortenerHistoryId_key";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hash" TEXT NOT NULL,
    "urlShortenerHistoryId" INTEGER NOT NULL,
    "urlShortenerRecordId" INTEGER,
    "mediaId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "File_hash_key" ON "File"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "File_mediaId_key" ON "File"("mediaId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_mediaId_fkey" FOREIGN KEY ("mediaId") REFERENCES "Media"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
