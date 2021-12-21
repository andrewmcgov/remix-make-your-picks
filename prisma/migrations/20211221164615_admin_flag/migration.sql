-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Game` DROP FOREIGN KEY `Game_ibfk_1`;

-- DropForeignKey
ALTER TABLE `LeaderboardEntry` DROP FOREIGN KEY `LeaderboardEntry_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `Pick_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `Pick_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `Pick_ibfk_3`;

-- DropForeignKey
ALTER TABLE `TieBreaker` DROP FOREIGN KEY `TieBreaker_ibfk_1`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `isAdmin` BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_homeId_fkey` FOREIGN KEY (`homeId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Game` ADD CONSTRAINT `Game_awayId_fkey` FOREIGN KEY (`awayId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pick` ADD CONSTRAINT `Pick_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `Game`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pick` ADD CONSTRAINT `Pick_teamId_fkey` FOREIGN KEY (`teamId`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Pick` ADD CONSTRAINT `Pick_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LeaderboardEntry` ADD CONSTRAINT `LeaderboardEntry_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TieBreaker` ADD CONSTRAINT `TieBreaker_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.email_unique` TO `User_email_key`;

-- RenameIndex
ALTER TABLE `User` RENAME INDEX `User.username_unique` TO `User_username_key`;
