CREATE TABLE `participant` (
	`id` int AUTO_INCREMENT NOT NULL,
	`race_id` int NOT NULL,
	`runner_id` int NOT NULL,
	`bib_number` int NOT NULL,
	`stopped` boolean NOT NULL,
	CONSTRAINT `participant_id` PRIMARY KEY(`id`),
	CONSTRAINT `participant_raceId_runnerId_unique` UNIQUE(`race_id`,`runner_id`),
	CONSTRAINT `participant_raceId_bibNumber_unique` UNIQUE(`race_id`,`bib_number`)
);
--> statement-breakpoint
ALTER TABLE `passage` RENAME COLUMN `runner_id` TO `participant_id`;--> statement-breakpoint
ALTER TABLE `passage` DROP FOREIGN KEY `passage_runner_id_runner_id_fk`;
--> statement-breakpoint
ALTER TABLE `runner` DROP FOREIGN KEY `runner_race_id_race_id_fk`;
--> statement-breakpoint
ALTER TABLE `runner` MODIFY COLUMN `id` int AUTO_INCREMENT NOT NULL;--> statement-breakpoint

--
-- Data transition
--

-- Move runner ID to temp bib_number
ALTER TABLE `runner` ADD `bib_number` int;--> statement-breakpoint
UPDATE `runner` SET `bib_number` = `id`;--> statement-breakpoint

-- Reset IDs in runner table
CREATE TABLE `temp_runner` AS SELECT * FROM `runner`;--> statement-breakpoint
TRUNCATE TABLE runner;--> statement-breakpoint
INSERT INTO runner (firstname, lastname, gender, birth_year, stopped, race_id, bib_number) SELECT firstname, lastname, gender, birth_year, stopped, race_id, bib_number FROM temp_runner;--> statement-breakpoint
DROP TABLE `temp_runner`;--> statement-breakpoint

-- Transfer data from runner to participant table
INSERT INTO `participant` (race_id, runner_id, bib_number, stopped) SELECT race_id, id, bib_number, stopped FROM `runner`;--> statement-breakpoint

ALTER TABLE `runner` DROP `bib_number`;--> statement-breakpoint

UPDATE `passage` INNER JOIN `participant` ON passage.participant_id = participant.bib_number SET passage.participant_id = participant.id;--> statement-breakpoint

--
-- End data transition
--

ALTER TABLE `participant` ADD CONSTRAINT `participant_race_id_race_id_fk` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `participant` ADD CONSTRAINT `participant_runner_id_runner_id_fk` FOREIGN KEY (`runner_id`) REFERENCES `runner`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passage` ADD CONSTRAINT `passage_participant_id_participant_id_fk` FOREIGN KEY (`participant_id`) REFERENCES `participant`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `runner` DROP COLUMN `stopped`;--> statement-breakpoint
ALTER TABLE `runner` DROP COLUMN `race_id`;
