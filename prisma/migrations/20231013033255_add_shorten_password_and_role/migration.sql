-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "role" TEXT;

-- AlterTable
ALTER TABLE "UrlShortenerHistory" ADD COLUMN     "usePasswordForward" BOOLEAN NOT NULL DEFAULT true;
