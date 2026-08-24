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
    "guestOfId" TEXT,
    "defaultCurrency" TEXT DEFAULT 'CAD',
    CONSTRAINT "User_guestOfId_fkey" FOREIGN KEY ("guestOfId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_User" ("defaultCurrency", "email", "emailVerified", "guestOfId", "id", "image", "name", "password") SELECT "defaultCurrency", "email", "emailVerified", "guestOfId", "id", "image", "name", "password" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "new_applications" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "roleTitle" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "dateApplied" DATETIME,
    "jobUrl" TEXT,
    "location" TEXT,
    "notes" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "salary" INTEGER,
    "salaryCurrency" TEXT DEFAULT 'CAD',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "applications_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_applications" ("companyId", "createdAt", "dateApplied", "id", "jobUrl", "location", "notes", "roleTitle", "salary", "salaryCurrency", "sortOrder", "status", "updatedAt", "userId") SELECT "companyId", "createdAt", "dateApplied", "id", "jobUrl", "location", "notes", "roleTitle", "salary", "salaryCurrency", "sortOrder", "status", "updatedAt", "userId" FROM "applications";
DROP TABLE "applications";
ALTER TABLE "new_applications" RENAME TO "applications";
CREATE INDEX "applications_userId_idx" ON "applications"("userId");
CREATE INDEX "applications_companyId_idx" ON "applications"("companyId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
