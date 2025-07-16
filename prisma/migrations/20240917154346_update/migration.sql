/*
  Warnings:

  - Made the column `slug` on table `product_collections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "product_collections" ALTER COLUMN "slug" SET NOT NULL;
