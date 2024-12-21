ALTER TABLE `race` DROP INDEX `race_name_unique`;--> statement-breakpoint
ALTER TABLE `race` ADD CONSTRAINT `race_name_editionId_unique` UNIQUE(`name`,`edition_id`);