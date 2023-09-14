/*
  Warnings:

  - You are about to drop the column `uuid` on the `Note` table. All the data in the column will be lost.
  - You are about to drop the column `noteId` on the `UrlForwardMeta` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[uid]` on the table `Note` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `uid` to the `Note` table without a default value. This is not possible if the table is not empty.
  - Added the required column `urlShortenerHistoryId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UrlForwardMeta" DROP CONSTRAINT "UrlForwardMeta_noteId_fkey";

-- DropIndex
DROP INDEX "Note_uuid_key";

-- DropIndex
DROP INDEX "UrlForwardMeta_userAgent_ip_noteId_key";

-- AlterTable
ALTER TABLE "Note" DROP COLUMN "uuid",
ADD COLUMN     "uid" TEXT NOT NULL,
ADD COLUMN     "urlShortenerHistoryId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "UrlForwardMeta" DROP COLUMN "noteId";

-- CreateIndex
CREATE UNIQUE INDEX "Note_uid_key" ON "Note"("uid");

-- AddForeignKey
ALTER TABLE "Note" ADD CONSTRAINT "Note_urlShortenerHistoryId_fkey" FOREIGN KEY ("urlShortenerHistoryId") REFERENCES "UrlShortenerHistory"("id") ON DELETE CASCADE ON UPDATE CASCADE;
