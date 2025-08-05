/*
  Warnings:

  - You are about to drop the column `order` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `subCategory` on the `Listing` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "pushToken" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Category" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Category" ("createdAt", "icon", "id", "name", "slug", "updatedAt") SELECT "createdAt", "icon", "id", "name", "slug", "updatedAt" FROM "Category";
DROP TABLE "Category";
ALTER TABLE "new_Category" RENAME TO "Category";
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");
CREATE TABLE "new_Listing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" REAL NOT NULL,
    "location" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "images" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "year" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "premiumFeatures" TEXT,
    "premiumUntil" DATETIME,
    "premiumPlan" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "approvedAt" DATETIME,
    "rejectedAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Listing" ("approvedAt", "brand", "category", "condition", "createdAt", "description", "features", "id", "images", "isPremium", "location", "model", "premiumFeatures", "premiumPlan", "premiumUntil", "price", "rejectedAt", "status", "title", "updatedAt", "userId", "views", "year") SELECT "approvedAt", "brand", "category", "condition", "createdAt", "description", "features", "id", "images", "isPremium", "location", "model", "premiumFeatures", "premiumPlan", "premiumUntil", "price", "rejectedAt", "status", "title", "updatedAt", "userId", "views", "year" FROM "Listing";
DROP TABLE "Listing";
ALTER TABLE "new_Listing" RENAME TO "Listing";
CREATE TABLE "new_SubCategory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "icon" TEXT,
    "parentId" TEXT,
    CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SubCategory_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "SubCategory" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SubCategory" ("categoryId", "createdAt", "icon", "id", "name", "order", "slug", "updatedAt") SELECT "categoryId", "createdAt", "icon", "id", "name", "order", "slug", "updatedAt" FROM "SubCategory";
DROP TABLE "SubCategory";
ALTER TABLE "new_SubCategory" RENAME TO "SubCategory";
CREATE UNIQUE INDEX "SubCategory_name_categoryId_key" ON "SubCategory"("name", "categoryId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
