CREATE TABLE `passage_import_rule` (
	`id` int AUTO_INCREMENT NOT NULL,
	`url` varchar(2000) NOT NULL,
	`is_active` boolean NOT NULL,
	CONSTRAINT `passage_import_rule_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `passage_import_rule_race` (
	`rule_id` int NOT NULL,
	`race_id` int NOT NULL
);
--> statement-breakpoint
ALTER TABLE `passage_import_rule_race` ADD CONSTRAINT `passage_import_rule_race_rule_id_passage_import_rule_id_fk` FOREIGN KEY (`rule_id`) REFERENCES `passage_import_rule`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passage_import_rule_race` ADD CONSTRAINT `passage_import_rule_race_race_id_race_id_fk` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE no action ON UPDATE no action;