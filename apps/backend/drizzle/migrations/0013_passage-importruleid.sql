ALTER TABLE `passage` ADD `import_rule_id` int AFTER `import_time`;--> statement-breakpoint
ALTER TABLE `passage` ADD CONSTRAINT `passage_import_rule_id_passage_import_rule_id_fk` FOREIGN KEY (`import_rule_id`) REFERENCES `passage_import_rule`(`id`) ON DELETE no action ON UPDATE no action;
