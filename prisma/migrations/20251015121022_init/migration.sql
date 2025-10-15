-- CreateTable
CREATE TABLE `assets` (
    `id` VARCHAR(36) NOT NULL,
    `entityType` ENUM('PRODUCT', 'PROFILE', 'ORDER', 'INVOICE', 'BANNER', 'LOGO', 'GALLERY', 'OTHER') NOT NULL,
    `entityId` VARCHAR(36) NOT NULL,
    `originalName` VARCHAR(255) NOT NULL,
    `sanitizedName` VARCHAR(255) NOT NULL,
    `fileType` ENUM('IMAGE', 'DOCUMENT', 'SPREADSHEET') NOT NULL,
    `mimeType` VARCHAR(100) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `basePath` VARCHAR(500) NOT NULL,
    `status` ENUM('ACTIVE', 'PROCESSING', 'ARCHIVED', 'DELETED') NOT NULL DEFAULT 'PROCESSING',
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `metadata` JSON NULL,

    INDEX `idx_entity`(`entityType`, `entityId`),
    INDEX `idx_type_status`(`fileType`, `status`),
    INDEX `idx_uploaded`(`uploadedAt`),
    INDEX `idx_deleted`(`deletedAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_versions` (
    `id` VARCHAR(36) NOT NULL,
    `assetId` VARCHAR(36) NOT NULL,
    `versionType` VARCHAR(50) NOT NULL,
    `fileName` VARCHAR(255) NOT NULL,
    `filePath` VARCHAR(500) NOT NULL,
    `fileSize` INTEGER NOT NULL,
    `width` INTEGER NULL,
    `height` INTEGER NULL,
    `isProcessed` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_asset_version`(`assetId`, `versionType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_tags` (
    `id` VARCHAR(36) NOT NULL,
    `assetId` VARCHAR(36) NOT NULL,
    `tag` VARCHAR(100) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_tag`(`tag`),
    INDEX `idx_asset_tag`(`assetId`),
    UNIQUE INDEX `asset_tags_assetId_tag_key`(`assetId`, `tag`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `asset_logs` (
    `id` VARCHAR(36) NOT NULL,
    `assetId` VARCHAR(36) NOT NULL,
    `operation` VARCHAR(50) NOT NULL,
    `ipAddress` VARCHAR(45) NULL,
    `userAgent` VARCHAR(500) NULL,
    `metadata` JSON NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `idx_asset_log`(`assetId`),
    INDEX `idx_operation_date`(`operation`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `system_config` (
    `id` VARCHAR(36) NOT NULL,
    `configKey` VARCHAR(100) NOT NULL,
    `configValue` TEXT NOT NULL,
    `description` VARCHAR(500) NULL,
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `system_config_configKey_key`(`configKey`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `asset_versions` ADD CONSTRAINT `asset_versions_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `asset_tags` ADD CONSTRAINT `asset_tags_assetId_fkey` FOREIGN KEY (`assetId`) REFERENCES `assets`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
