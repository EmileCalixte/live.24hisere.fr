CREATE TABLE `edition` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`order` int NOT NULL,
	`is_public` boolean NOT NULL,
	CONSTRAINT `edition_id` PRIMARY KEY(`id`),
	CONSTRAINT `edition_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint

ALTER TABLE `race` ADD `edition_id` int NOT NULL AFTER `id`;--> statement-breakpoint

-- Create an edition
INSERT INTO `edition` (`name`, `order`, `is_public`) VALUES ('2024 - 7ème édition', 0, 1);--> statement-breakpoint

-- Add existing races to the created edition
UPDATE `race` SET `edition_id` = 1;--> statement-breakpoint

ALTER TABLE `race` ADD CONSTRAINT `race_edition_id_edition_id_fk` FOREIGN KEY (`edition_id`) REFERENCES `edition`(`id`) ON DELETE no action ON UPDATE no action;
