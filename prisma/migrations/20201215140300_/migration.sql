-- CreateTable
CREATE TABLE `User` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `resetToken` VARCHAR(191),
    `resetExpiry` VARCHAR(191),
UNIQUE INDEX `User.email_unique`(`email`),
UNIQUE INDEX `User.username_unique`(`username`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Team` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `city` VARCHAR(191) NOT NULL,
    `fullName` VARCHAR(191) NOT NULL,
    `nickName` VARCHAR(191) NOT NULL,
    `league` VARCHAR(191) NOT NULL,
    `abr` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Game` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `homeId` INT NOT NULL,
    `awayId` INT NOT NULL,
    `start` DATETIME(3) NOT NULL,
    `winnerId` VARCHAR(191),
    `league` VARCHAR(191) NOT NULL,
    `week` VARCHAR(191) NOT NULL,
    `season` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Game` ADD FOREIGN KEY (`homeId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD FOREIGN KEY (`awayId`) REFERENCES `Team`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
