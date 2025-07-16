-- DropForeignKey
ALTER TABLE "product_product_collections" DROP CONSTRAINT "product_product_collections_productId_fkey";

-- AddForeignKey
ALTER TABLE "product_product_collections" ADD CONSTRAINT "product_product_collections_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
