/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `bundle_discounts` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `product_collections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `bundle_discounts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `inventories` table without a default value. This is not possible if the table is not empty.
  - Made the column `currentQuantity` on table `inventories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `inventories` required. This step will fail if there are existing NULL values in that column.
  - Made the column `inventoryId` on table `inventorory_notes` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `displayOrder` to the `product_collections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "inventories" DROP CONSTRAINT "inventories_productId_fkey";

-- DropForeignKey
ALTER TABLE "inventorory_notes" DROP CONSTRAINT "inventorory_notes_inventoryId_fkey";

-- AlterTable
ALTER TABLE "abandoned_carts" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "addresses" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "bundle_discounts" ADD COLUMN     "bgImage" TEXT,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "categories" ALTER COLUMN "metaTitle" DROP NOT NULL,
ALTER COLUMN "metaDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "inventories" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "currentQuantity" SET NOT NULL,
ALTER COLUMN "productId" SET NOT NULL;

-- AlterTable
ALTER TABLE "inventorory_notes" ALTER COLUMN "inventoryId" SET NOT NULL;

-- AlterTable
ALTER TABLE "product_collections" ADD COLUMN     "displayOrder" INTEGER NOT NULL,
ADD COLUMN     "slug" TEXT;

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "careInstructions" TEXT,
ADD COLUMN     "productDetails" TEXT,
ADD COLUMN     "productFaq" TEXT,
ALTER COLUMN "metaTitle" DROP NOT NULL,
ALTER COLUMN "metaDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "setPassword" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "discount_banners" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "banner" TEXT NOT NULL,
    "bgImage" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "discount_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order-notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "orderId" TEXT,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order-notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner_ads" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banner_ads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "careers" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "shortDescription" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "applyUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "careers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "expectedSalary" DOUBLE PRECISION NOT NULL,
    "message" TEXT,
    "resume" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "shortDescription" TEXT,
    "content" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "meta_title" TEXT NOT NULL,
    "meta_description" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custom_designs" (
    "id" TEXT NOT NULL,
    "wantCustomDesign" TEXT NOT NULL,
    "designType" TEXT,
    "productDesign" JSONB,
    "numberOfDesigns" TEXT,
    "deliveryDate" TEXT,
    "hasImage" TEXT,
    "designImage" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "additionalDetails" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_designs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "discount_banners_slug_key" ON "discount_banners"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "bundle_discounts_slug_key" ON "bundle_discounts"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "product_collections_slug_key" ON "product_collections"("slug");

-- AddForeignKey
ALTER TABLE "inventories" ADD CONSTRAINT "inventories_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventorory_notes" ADD CONSTRAINT "inventorory_notes_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-notifications" ADD CONSTRAINT "order-notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order-notifications" ADD CONSTRAINT "order-notifications_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banner_ads" ADD CONSTRAINT "banner_ads_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
