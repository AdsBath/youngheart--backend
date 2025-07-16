-- DropForeignKey
ALTER TABLE "inventorory_notes" DROP CONSTRAINT "inventorory_notes_inventoryId_fkey";

-- AddForeignKey
ALTER TABLE "inventorory_notes" ADD CONSTRAINT "inventorory_notes_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
