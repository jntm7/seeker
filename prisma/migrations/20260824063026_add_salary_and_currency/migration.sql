-- AlterTable
ALTER TABLE "User" ADD COLUMN "defaultCurrency" TEXT DEFAULT 'USD';

-- AlterTable
ALTER TABLE "applications" ADD COLUMN "salary" INTEGER;
ALTER TABLE "applications" ADD COLUMN "salaryCurrency" TEXT DEFAULT 'USD';
