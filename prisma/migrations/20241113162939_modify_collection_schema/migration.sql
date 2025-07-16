/*
  Warnings:

  - Added the required column `imageUrl` to the `product_collections` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_collections" ADD COLUMN     "imageUrl" TEXT NOT NULL;
