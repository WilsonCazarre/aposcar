CREATE TABLE "aposcar_receivers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"name" text,
	"image" text,
	"letterboxd" text,
	CONSTRAINT "aposcar_receivers_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "aposcar_nominees" RENAME TO "aposcar_movies";--> statement-breakpoint
ALTER TABLE "aposcar_nominations" RENAME COLUMN "primaryNominee" TO "movie";--> statement-breakpoint
ALTER TABLE "aposcar_nominations" RENAME COLUMN "secondaryNominee" TO "receiver";--> statement-breakpoint
ALTER TABLE "aposcar_movies" DROP CONSTRAINT "aposcar_nominees_slug_unique";--> statement-breakpoint
ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_category_aposcar_categories_id_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_primaryNominee_aposcar_nominees_id_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_secondaryNominee_aposcar_nominees_id_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_categoryTypesPoints" ALTER COLUMN "categoryType" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_category_aposcar_categories_slug_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_movie_aposcar_movies_slug_fk" FOREIGN KEY ("movie") REFERENCES "public"."aposcar_movies"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_receiver_aposcar_receivers_slug_fk" FOREIGN KEY ("receiver") REFERENCES "public"."aposcar_receivers"("slug") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_movies" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "aposcar_categoryTypesPoints" ADD CONSTRAINT "aposcar_categoryTypesPoints_categoryType_unique" UNIQUE("categoryType");--> statement-breakpoint
ALTER TABLE "aposcar_movies" ADD CONSTRAINT "aposcar_movies_slug_unique" UNIQUE("slug");--> statement-breakpoint
DROP TYPE "public"."nomineeType";