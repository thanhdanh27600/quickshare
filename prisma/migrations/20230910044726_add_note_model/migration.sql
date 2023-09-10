-- AlterTable
ALTER TABLE "UrlForwardMeta"
ADD COLUMN "noteId" INTEGER,
  ALTER COLUMN "urlShortenerHistoryId" DROP NOT NULL;
-- AlterTable
ALTER TABLE "UrlShortenerHistory"
ADD COLUMN "theme" TEXT NOT NULL DEFAULT 'default';
-- CreateTable
CREATE TABLE "Note" (
  "id" SERIAL NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  "hash" TEXT NOT NULL,
  "uuid" TEXT NOT NULL,
  "text" TEXT NOT NULL,
  "email" TEXT,
  "password" TEXT,
  "urlShortenerRecordId" INTEGER NOT NULL,
  CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "Note_hash_key" ON "Note"("hash");
-- CreateIndex
CREATE UNIQUE INDEX "Note_uuid_key" ON "Note"("uuid");
-- CreateIndex
CREATE UNIQUE INDEX "UrlForwardMeta_userAgent_ip_noteId_key" ON "UrlForwardMeta"("userAgent", "ip", "noteId");
-- AddForeignKey
ALTER TABLE "UrlForwardMeta"
ADD CONSTRAINT "UrlForwardMeta_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "Note"
ADD CONSTRAINT "Note_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;
