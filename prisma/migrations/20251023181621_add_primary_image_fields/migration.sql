-- AlterTable
ALTER TABLE `assets` ADD COLUMN `displayOrder` INTEGER NULL,
    ADD COLUMN `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    MODIFY `entityType` ENUM('PRODUCT', 'PROFILE', 'ORDER', 'INVOICE', 'BANNER', 'LOGO', 'CATEGORY', 'BRAND', 'GALLERY', 'OTHER') NOT NULL;

-- CreateIndex
CREATE INDEX `idx_entity_primary` ON `assets`(`entityType`, `entityId`, `isPrimary`);

-- CreateIndex
CREATE INDEX `idx_entity_order` ON `assets`(`entityType`, `entityId`, `displayOrder`);
