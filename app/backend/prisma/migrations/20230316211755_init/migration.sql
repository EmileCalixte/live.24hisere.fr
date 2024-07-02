-- CreateTable
CREATE TABLE `access_token` (
    `token` VARCHAR(32) NOT NULL,
    `user_id` INTEGER NOT NULL,
    `expiration_date` DATETIME(0) NOT NULL,

    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `config` (
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(5000) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `misc` (
    `key` VARCHAR(255) NOT NULL,
    `value` VARCHAR(5000) NOT NULL,

    PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `passage` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `detection_id` INTEGER NULL,
    `runner_id` INTEGER NOT NULL,
    `time` DATETIME(0) NOT NULL,
    `is_hidden` BOOLEAN NOT NULL,

    UNIQUE INDEX `passage_runner_id_detection_id_key`(`runner_id`, `detection_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `race` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `start_time` DATETIME(0) NOT NULL,
    `duration` INTEGER UNSIGNED NOT NULL,
    `initial_distance` DECIMAL(10, 3) NOT NULL,
    `lap_distance` DECIMAL(10, 3) NOT NULL,
    `order` INTEGER NOT NULL,
    `is_public` BOOLEAN NOT NULL,

    UNIQUE INDEX `race_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `runner` (
    `id` INTEGER NOT NULL,
    `firstname` VARCHAR(255) NOT NULL,
    `lastname` VARCHAR(255) NOT NULL,
    `gender` VARCHAR(1) NOT NULL,
    `birth_year` VARCHAR(255) NOT NULL,
    `race_id` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(32) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `user_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `access_token` ADD CONSTRAINT `access_token_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `passage` ADD CONSTRAINT `passage_runner_id_fkey` FOREIGN KEY (`runner_id`) REFERENCES `runner`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `runner` ADD CONSTRAINT `runner_race_id_fkey` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE RESTRICT ON UPDATE RESTRICT;
