-- CreateTable
CREATE TABLE `admin_users` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `admin_users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin_sessions` (
    `id` VARCHAR(191) NOT NULL,
    `adminUserId` VARCHAR(191) NOT NULL,
    `tokenHash` CHAR(64) NOT NULL,
    `expiresAt` DATETIME(3) NOT NULL,
    `lastUsedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `admin_sessions_tokenHash_key`(`tokenHash`),
    INDEX `admin_sessions_adminUserId_idx`(`adminUserId`),
    INDEX `admin_sessions_expiresAt_idx`(`expiresAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `gifts` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(150) NOT NULL,
    `slug` VARCHAR(180) NOT NULL,
    `description` TEXT NOT NULL,
    `imageUrl` VARCHAR(1000) NULL,
    `priceInCents` INTEGER NOT NULL,
    `storeUrl` VARCHAR(1000) NULL,
    `allowStorePurchase` BOOLEAN NOT NULL DEFAULT false,
    `allowPix` BOOLEAN NOT NULL DEFAULT true,
    `quotaCount` INTEGER NULL,
    `status` ENUM('AVAILABLE', 'RESERVED', 'COMPLETED', 'ARCHIVED') NOT NULL DEFAULT 'AVAILABLE',
    `featured` BOOLEAN NOT NULL DEFAULT false,
    `displayOrder` INTEGER NOT NULL DEFAULT 0,
    `reservedUntil` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `gifts_slug_key`(`slug`),
    INDEX `gifts_status_idx`(`status`),
    INDEX `gifts_displayOrder_idx`(`displayOrder`),
    INDEX `gifts_featured_idx`(`featured`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `contributions` (
    `id` VARCHAR(191) NOT NULL,
    `giftId` VARCHAR(191) NOT NULL,
    `buyerName` VARCHAR(150) NOT NULL,
    `buyerEmail` VARCHAR(200) NULL,
    `buyerPhone` VARCHAR(30) NULL,
    `method` ENUM('PIX', 'STORE') NOT NULL,
    `status` ENUM('PENDING', 'RESERVED', 'CONFIRMED', 'CANCELED') NOT NULL DEFAULT 'PENDING',
    `amountInCents` INTEGER NOT NULL,
    `quotaQuantity` INTEGER NULL,
    `paymentReceiptUrl` VARCHAR(1000) NULL,
    `reservedUntil` DATETIME(3) NULL,
    `confirmedAt` DATETIME(3) NULL,
    `canceledAt` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `contributions_giftId_idx`(`giftId`),
    INDEX `contributions_status_idx`(`status`),
    INDEX `contributions_method_idx`(`method`),
    INDEX `contributions_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `letters` (
    `id` VARCHAR(191) NOT NULL,
    `giftId` VARCHAR(191) NULL,
    `contributionId` VARCHAR(191) NULL,
    `authorName` VARCHAR(150) NOT NULL,
    `message` TEXT NOT NULL,
    `isAnonymous` BOOLEAN NOT NULL DEFAULT false,
    `status` ENUM('PENDING', 'APPROVED', 'HIDDEN', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `letters_contributionId_key`(`contributionId`),
    INDEX `letters_giftId_idx`(`giftId`),
    INDEX `letters_status_idx`(`status`),
    INDEX `letters_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `site_settings` (
    `id` VARCHAR(191) NOT NULL DEFAULT 'main',
    `coupleName` VARCHAR(150) NOT NULL,
    `heroTitle` VARCHAR(200) NOT NULL,
    `heroDescription` TEXT NOT NULL,
    `heroImageUrl` VARCHAR(1000) NULL,
    `movingDate` DATETIME(3) NULL,
    `pixKey` VARCHAR(255) NULL,
    `pixKeyType` VARCHAR(30) NULL,
    `pixReceiverName` VARCHAR(150) NULL,
    `pixCity` VARCHAR(100) NULL,
    `whatsapp` VARCHAR(30) NULL,
    `lettersEnabled` BOOLEAN NOT NULL DEFAULT true,
    `publicGiftValues` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `admin_sessions` ADD CONSTRAINT `admin_sessions_adminUserId_fkey` FOREIGN KEY (`adminUserId`) REFERENCES `admin_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `contributions` ADD CONSTRAINT `contributions_giftId_fkey` FOREIGN KEY (`giftId`) REFERENCES `gifts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letters` ADD CONSTRAINT `letters_giftId_fkey` FOREIGN KEY (`giftId`) REFERENCES `gifts`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `letters` ADD CONSTRAINT `letters_contributionId_fkey` FOREIGN KEY (`contributionId`) REFERENCES `contributions`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
