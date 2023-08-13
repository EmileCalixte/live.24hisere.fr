/*
  Warnings:

  - A unique constraint covering the columns `[detection_id]` on the table `passage` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `passage_detection_id_key` ON `passage`(`detection_id`);
