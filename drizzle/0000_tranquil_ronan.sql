CREATE TABLE IF NOT EXISTS "aposcar_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"name" text,
	"description" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aposcar_nominations" (
	"isWinner" boolean,
	"category" uuid,
	"primaryNominee" uuid NOT NULL,
	"secondaryNominee" uuid,
	CONSTRAINT "aposcar_nominations_primaryNominee_secondaryNominee_pk" PRIMARY KEY("primaryNominee","secondaryNominee")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "aposcar_nominees" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text,
	"name" text,
	"description" text,
	"image" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_category_aposcar_categories_id_fk" FOREIGN KEY ("category") REFERENCES "public"."aposcar_categories"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_primaryNominee_aposcar_nominees_id_fk" FOREIGN KEY ("primaryNominee") REFERENCES "public"."aposcar_nominees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "aposcar_nominations" ADD CONSTRAINT "aposcar_nominations_secondaryNominee_aposcar_nominees_id_fk" FOREIGN KEY ("secondaryNominee") REFERENCES "public"."aposcar_nominees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
