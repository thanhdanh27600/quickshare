/*
  Warnings:

  - A unique constraint covering the columns `[urlShortenerRecordId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Made the column `fromClientSide` on table `UrlForwardMeta` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UrlForwardMeta" ALTER COLUMN "fromClientSide" SET NOT NULL;

-- AlterTable
ALTER TABLE "UrlShortenerHistory" ADD COLUMN     "isBanned" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "UrlShortenerRecord" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "urlShortenerRecordId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_urlShortenerRecordId_key" ON "User"("urlShortenerRecordId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_urlShortenerRecordId_fkey" FOREIGN KEY ("urlShortenerRecordId") REFERENCES "UrlShortenerRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
