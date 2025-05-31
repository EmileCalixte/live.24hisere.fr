CREATE TABLE `custom_runner_category` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(4) NOT NULL,
	`name` varchar(50) NOT NULL,
	CONSTRAINT `custom_runner_category_id` PRIMARY KEY(`id`),
	CONSTRAINT `custom_runner_category_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
ALTER TABLE `participant` ADD `custom_category_id` int AFTER `bib_number`;--> statement-breakpoint
ALTER TABLE `participant` ADD CONSTRAINT `participant_custom_category_id_custom_runner_category_id_fk` FOREIGN KEY (`custom_category_id`) REFERENCES `custom_runner_category`(`id`) ON DELETE no action ON UPDATE no action;
