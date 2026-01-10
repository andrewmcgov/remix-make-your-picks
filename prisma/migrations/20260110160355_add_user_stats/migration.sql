-- CreateTable
CREATE TABLE `UserStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `totalPlayoffGamesPicked` INTEGER NOT NULL DEFAULT 0,
    `totalCorrectPicks` INTEGER NOT NULL DEFAULT 0,
    `correctPickPercentage` DOUBLE NOT NULL DEFAULT 0.0,
    `bestLeaderboardPosition` INTEGER NULL,
    `averageLeaderboardPosition` DOUBLE NULL,
    `lastUpdated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `UserStats_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserStats` ADD CONSTRAINT `UserStats_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
