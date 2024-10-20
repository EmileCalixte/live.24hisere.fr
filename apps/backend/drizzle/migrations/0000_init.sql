CREATE TABLE `access_token` (
	`token` varchar(32) NOT NULL,
	`user_id` int NOT NULL,
	`expiration_date` datetime(0) NOT NULL,
	CONSTRAINT `access_token_token` PRIMARY KEY(`token`)
);
--> statement-breakpoint
CREATE TABLE `config` (
	`key` varchar(255) NOT NULL,
	`value` varchar(5000) NOT NULL,
	CONSTRAINT `config_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `misc` (
	`key` varchar(255) NOT NULL,
	`value` varchar(5000) NOT NULL,
	CONSTRAINT `misc_key` PRIMARY KEY(`key`)
);
--> statement-breakpoint
CREATE TABLE `passage` (
	`id` int AUTO_INCREMENT NOT NULL,
	`detection_id` int,
	`import_time` datetime(0),
	`runner_id` int NOT NULL,
	`time` datetime(0) NOT NULL,
	`is_hidden` boolean NOT NULL,
	CONSTRAINT `passage_id` PRIMARY KEY(`id`),
	CONSTRAINT `passage_detection_id_unique` UNIQUE(`detection_id`)
);
--> statement-breakpoint
CREATE TABLE `race` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(50) NOT NULL,
	`start_time` datetime(0) NOT NULL,
	`duration` int unsigned NOT NULL,
	`initial_distance` decimal(10,3) NOT NULL,
	`lap_distance` decimal(10,3) NOT NULL,
	`order` int NOT NULL,
	`is_public` boolean NOT NULL,
	CONSTRAINT `race_id` PRIMARY KEY(`id`),
	CONSTRAINT `race_name_unique` UNIQUE(`name`)
);
--> statement-breakpoint
CREATE TABLE `runner` (
	`id` int NOT NULL,
	`firstname` varchar(255) NOT NULL,
	`lastname` varchar(255) NOT NULL,
	`gender` varchar(1) NOT NULL,
	`birth_year` varchar(4) NOT NULL,
	`stopped` boolean NOT NULL,
	`race_id` int NOT NULL,
	CONSTRAINT `runner_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(32) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	CONSTRAINT `user_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `access_token` ADD CONSTRAINT `access_token_user_id_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `passage` ADD CONSTRAINT `passage_runner_id_runner_id_fk` FOREIGN KEY (`runner_id`) REFERENCES `runner`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `runner` ADD CONSTRAINT `runner_race_id_race_id_fk` FOREIGN KEY (`race_id`) REFERENCES `race`(`id`) ON DELETE no action ON UPDATE no action;