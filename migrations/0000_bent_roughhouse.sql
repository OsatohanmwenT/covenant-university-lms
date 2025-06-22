CREATE TABLE `acquisition_requests` (
	`request_id` int AUTO_INCREMENT NOT NULL,
	`resource_identifier` varchar(50) NOT NULL,
	`title` varchar(200) NOT NULL,
	`author` varchar(100),
	`publication_date` date,
	`requested_date` date NOT NULL,
	`requested_by_user_id` int NOT NULL,
	`is_approved` boolean NOT NULL DEFAULT false,
	`approved_by_user_id` int,
	CONSTRAINT `acquisition_requests_request_id` PRIMARY KEY(`request_id`)
);
--> statement-breakpoint
CREATE TABLE `damage_report` (
	`damage_report_id` int AUTO_INCREMENT NOT NULL,
	`resource_id` int NOT NULL,
	`reported_date` date NOT NULL,
	`damage_description` text NOT NULL,
	`is_reparable` boolean NOT NULL,
	`repair_due_date` date,
	`repair_completed_date` date,
	`reported_by_user_id` int NOT NULL,
	CONSTRAINT `damage_report_damage_report_id` PRIMARY KEY(`damage_report_id`)
);
--> statement-breakpoint
CREATE TABLE `electronic_resource_backup` (
	`backup_id` int AUTO_INCREMENT NOT NULL,
	`resource_id` int NOT NULL,
	`backup_date` date NOT NULL,
	`accessibility_status` varchar(20),
	`notes` text,
	CONSTRAINT `electronic_resource_backup_backup_id` PRIMARY KEY(`backup_id`)
);
--> statement-breakpoint
CREATE TABLE `fines` (
	`fine_id` int AUTO_INCREMENT NOT NULL,
	`loan_id` int NOT NULL,
	`amount_per_day` int NOT NULL DEFAULT 100,
	`days_overdue` int NOT NULL,
	`total_amount` decimal(10,2) NOT NULL,
	`is_paid` boolean NOT NULL,
	`date_paid` date,
	CONSTRAINT `fines_fine_id` PRIMARY KEY(`fine_id`)
);
--> statement-breakpoint
CREATE TABLE `inventory_action` (
	`action_id` int AUTO_INCREMENT NOT NULL,
	`resource_id` int NOT NULL,
	`action_type` varchar(20) NOT NULL,
	`action_date` date NOT NULL,
	`notes` text,
	`performed_by_user_id` int,
	`approved_by_user_id` int,
	CONSTRAINT `inventory_action_action_id` PRIMARY KEY(`action_id`)
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`loan_id` int AUTO_INCREMENT NOT NULL,
	`resource_id` int NOT NULL,
	`user_id` int NOT NULL,
	`date_borrowed` date NOT NULL,
	`due_date` date NOT NULL,
	`date_returned` date,
	`status` varchar(20),
	CONSTRAINT `loans_loan_id` PRIMARY KEY(`loan_id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`notification_id` int AUTO_INCREMENT NOT NULL,
	`loan_id` int NOT NULL,
	`notification_type` varchar(50),
	`date_sent` date NOT NULL,
	`is_resolved` boolean NOT NULL,
	`sent_to_user_id` int,
	CONSTRAINT `notifications_notification_id` PRIMARY KEY(`notification_id`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`resource_id` int AUTO_INCREMENT NOT NULL,
	`unique_identifier` varchar(50) NOT NULL,
	`title` varchar(200) NOT NULL,
	`author` varchar(100),
	`publication_date` date,
	`category` varchar(50),
	`format` varchar(50),
	`location` varchar(100),
	`status` varchar(20),
	`resource_image` varchar(255),
	CONSTRAINT `resources_resource_id` PRIMARY KEY(`resource_id`),
	CONSTRAINT `resources_unique_identifier_unique` UNIQUE(`unique_identifier`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` int AUTO_INCREMENT NOT NULL,
	`full_name` varchar(150) NOT NULL,
	`role` enum('student','staff','faculty','admin') NOT NULL,
	`email` varchar(100) NOT NULL,
	`registration_date` timestamp DEFAULT (now()),
	`is_active` boolean NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `acquisition_requests` ADD CONSTRAINT `acquisition_requests_requested_by_user_id_users_user_id_fk` FOREIGN KEY (`requested_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `acquisition_requests` ADD CONSTRAINT `acquisition_requests_approved_by_user_id_users_user_id_fk` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damage_report` ADD CONSTRAINT `damage_report_resource_id_resources_resource_id_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `damage_report` ADD CONSTRAINT `damage_report_reported_by_user_id_users_user_id_fk` FOREIGN KEY (`reported_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `electronic_resource_backup` ADD CONSTRAINT `electronic_resource_backup_resource_id_resources_resource_id_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `fines` ADD CONSTRAINT `fines_loan_id_loans_loan_id_fk` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`loan_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_action` ADD CONSTRAINT `inventory_action_resource_id_resources_resource_id_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_action` ADD CONSTRAINT `inventory_action_performed_by_user_id_users_user_id_fk` FOREIGN KEY (`performed_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `inventory_action` ADD CONSTRAINT `inventory_action_approved_by_user_id_users_user_id_fk` FOREIGN KEY (`approved_by_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_resource_id_resources_resource_id_fk` FOREIGN KEY (`resource_id`) REFERENCES `resources`(`resource_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `loans` ADD CONSTRAINT `loans_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_loan_id_loans_loan_id_fk` FOREIGN KEY (`loan_id`) REFERENCES `loans`(`loan_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `notifications` ADD CONSTRAINT `notifications_sent_to_user_id_users_user_id_fk` FOREIGN KEY (`sent_to_user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;