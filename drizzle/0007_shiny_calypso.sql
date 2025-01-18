ALTER TABLE "aposcar_votes" RENAME COLUMN "userId" TO "user";--> statement-breakpoint
ALTER TABLE "aposcar_votes" RENAME COLUMN "nominationId" TO "nomination";--> statement-breakpoint
ALTER TABLE "aposcar_votes" DROP CONSTRAINT "aposcar_votes_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_votes" DROP CONSTRAINT "aposcar_votes_nominationId_aposcar_nominations_id_fk";
--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD COLUMN "category" uuid;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_user_user_id_fk" FOREIGN KEY ("user") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_nomination_aposcar_nominations_id_fk" FOREIGN KEY ("nomination") REFERENCES "public"."aposcar_nominations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_category_aposcar_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("id") ON DELETE cascade ON UPDATE no action;