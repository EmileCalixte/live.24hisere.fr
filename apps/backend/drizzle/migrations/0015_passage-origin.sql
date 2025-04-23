ALTER TABLE `passage` ADD `origin` VARCHAR(255) NULL AFTER `id`;--> statement-breakpoint
UPDATE `passage` SET `origin` = 'MANUAL' WHERE `detection_id` IS NULL AND `import_time` IS NULL;--> statement-breakpoint
UPDATE `passage` SET `origin` = 'DAG' WHERE `detection_id` IS NOT NULL;--> statement-breakpoint
UPDATE `passage` SET `origin` = 'CSV' WHERE `detection_id` IS NULL AND `import_time` IS NOT NULL;--> statement-breakpoint
ALTER TABLE `passage` CHANGE `origin` `origin` VARCHAR(255) NOT NULL;
