/*
  Warnings:

  - A unique constraint covering the columns `[externalId]` on the table `Media` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[urlShortenerHistoryId]` on the table `Note` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "externalId" TEXT,
ADD COLUMN     "name" TEXT NOT NULL DEFAULT 'No name',
ADD COLUMN     "noteId" INTEGER,
ADD COLUMN     "provider" TEXT,
ADD COLUMN     "type" TEXT;

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "title" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_externalId_key" ON "Media"("externalId");

-- CreateIndex
CREATE UNIQUE INDEX "Note_urlShortenerHistoryId_key" ON "Note"("urlShortenerHistoryId");

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_noteId_fkey" FOREIGN KEY ("noteId") REFERENCES "Note"("id") ON DELETE CASCADE ON UPDATE CASCADE;
