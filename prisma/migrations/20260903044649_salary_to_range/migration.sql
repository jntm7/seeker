-- RenameColumn
ALTER TABLE "applications" RENAME COLUMN "salary" TO "salaryMin";

-- AlterTable
ALTER TABLE "applications" ADD COLUMN "salaryMax" INTEGER;
