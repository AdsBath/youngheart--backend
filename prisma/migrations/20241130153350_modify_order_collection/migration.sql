/*
  Warnings:

  - You are about to alter the column `discount` on the `cart_items` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `discount` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "discountAmmount" DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "discountAmmount" DOUBLE PRECISION,
ALTER COLUMN "discount" SET DATA TYPE INTEGER;
