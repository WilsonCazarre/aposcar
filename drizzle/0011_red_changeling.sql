ALTER TABLE "user" ADD COLUMN "username" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "completedOnboarding" timestamp;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "favoriteMovie" uuid;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_favoriteMovie_aposcar_movies_id_fk" FOREIGN KEY ("favoriteMovie") REFERENCES "public"."aposcar_movies"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD CONSTRAINT "user_username_unique" UNIQUE("username");