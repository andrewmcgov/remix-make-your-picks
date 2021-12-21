/*
  Warnings:

  - You are about to alter the column `winnerId` on the `Game` table. The data in that column could be lost. The data in that column will be cast from `String` to `Int`.
  - You are about to alter the column `correct` on the `Pick` table. The data in that column could be lost. The data in that column will be cast from `String` to `Boolean`.

*/
-- AlterTable
ALTER TABLE `Game` MODIFY `winnerId` INT;

-- AlterTable
ALTER TABLE `Pick` ADD COLUMN     `closed` BOOLEAN,
    MODIFY `correct` BOOLEAN;
