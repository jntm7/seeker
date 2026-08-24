/*
  Warnings:

  - You are about to drop the `invites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `guestOfId` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "invites_email_status_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "invites";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" DATETIME,
    "image" TEXT,
    "password" TEXT,
    "defaultCurrency" TEXT DEFAULT 'CAD'
);
INSERT INTO "new_User" ("defaultCurrency", "email", "emailVerified", "id", "image", "name", "password") SELECT "defaultCurrency", "email", "emailVerified", "id", "image", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
