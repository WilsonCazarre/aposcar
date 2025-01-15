ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_category_aposcar_categories_slug_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_movie_aposcar_movies_slug_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_nominations" DROP CONSTRAINT "aposcar_nominations_receiver_aposcar_receivers_slug_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_category_aposcar_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_movie_aposcar_movies_id_fk" FOREIGN KEY ("movie") REFERENCES "public"."aposcar_movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_receiver_aposcar_receivers_id_fk" FOREIGN KEY ("receiver") REFERENCES "public"."aposcar_receivers"("id") ON DELETE no action ON UPDATE no action;