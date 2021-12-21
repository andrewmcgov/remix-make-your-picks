/*
  Warnings:

  - You are about to drop the `LeaderboardEntries` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `LeaderboardEntries` DROP FOREIGN KEY `leaderboardentries_ibfk_1`;

-- CreateTable
CREATE TABLE `LeaderboardEntry` (
    `id` INT NOT NULL AUTO_INCREMENT,
    `season` VARCHAR(191) NOT NULL,
    `userId` INT NOT NULL,
    `wildcard` INT NOT NULL,
    `division` INT NOT NULL,
    `conference` INT NOT NULL,
    `superbowl` INT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- DropTable
DROP TABLE `LeaderboardEntries`;

-- AddForeignKey
ALTER TABLE `LeaderboardEntry` ADD FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
