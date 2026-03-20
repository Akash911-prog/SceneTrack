CREATE TABLE `shows` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`type` text DEFAULT 'series' NOT NULL,
	`status` text DEFAULT 'planning' NOT NULL,
	`rating` integer,
	`notes` text,
	`genre` text,
	`totalEpisodes` integer,
	`watchedEpisodes` integer DEFAULT 0 NOT NULL,
	`startedAt` integer,
	`finishedAt` integer,
	`createdAt` integer,
	`updatedAt` integer
);
--> statement-breakpoint
CREATE TABLE `timestamps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`showId` integer NOT NULL,
	`episode` integer,
	`note` text,
	`loggedAt` integer,
	FOREIGN KEY (`showId`) REFERENCES `shows`(`id`) ON UPDATE no action ON DELETE cascade
);
