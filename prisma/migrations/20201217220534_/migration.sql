/*
  Warnings:

  - You are about to drop the `Pick` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `pick_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `pick_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Pick` DROP FOREIGN KEY `pick_ibfk_3`;

-- DropTable
DROP TABLE `Pick`;
