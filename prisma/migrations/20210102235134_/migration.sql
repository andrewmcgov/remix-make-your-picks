/*
  Warnings:

  - Added the required column `season` to the `LeaderboardEntries` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `LeaderboardEntries` ADD COLUMN     `season` VARCHAR(191) NOT NULL;
