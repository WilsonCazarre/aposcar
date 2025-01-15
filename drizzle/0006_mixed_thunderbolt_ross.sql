CREATE TABLE "aposcar_votes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" text NOT NULL,
	"nominationId" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "aposcar_votes" ADD CONSTRAINT "aposcar_votes_nominationId_aposcar_nominations_id_fk" FOREIGN KEY ("nominationId") REFERENCES "public"."aposcar_nominations"("id") ON DELETE cascade ON UPDATE no action;