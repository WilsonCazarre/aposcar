ALTER TABLE "aposcar_categories" ALTER COLUMN "slug" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_categories" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_categories" ALTER COLUMN "type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ALTER COLUMN "isWinner" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ALTER COLUMN "isWinner" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ALTER COLUMN "category" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ALTER COLUMN "movie" SET NOT NULL;