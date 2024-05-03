/*
  Warnings:

  - Added the required column `stopped` to the `runner` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `runner` ADD COLUMN `stopped` BOOLEAN DEFAULT FALSE;
ALTER TABLE `runner` CHANGE `stopped` `stopped` BOOLEAN NOT NULL;
