-- AlterTable
ALTER TABLE "product_collections" ADD COLUMN     "categoryId" TEXT,
ADD COLUMN     "categoryId2" TEXT,
ADD COLUMN     "imageUrl2" TEXT,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "title2" TEXT;

-- AddForeignKey
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_collections" ADD CONSTRAINT "product_collections_categoryId2_fkey" FOREIGN KEY ("categoryId2") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;
